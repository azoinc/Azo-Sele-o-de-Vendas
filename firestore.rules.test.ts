import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-test-rules-' + Date.now(),
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: 'localhost',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

describe('Firestore Rules - Dirty Dozen', () => {
  it('1. Unauthenticated read of corretores -> DENY', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(unauthedDb.collection('corretores').doc('123').get());
  });

  it('2. Unauthenticated create of visita -> DENY', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(unauthedDb.collection('visitas').doc('123').set({
      corretorId: '123',
    }));
  });

  it('3. Create corretor for another UID -> DENY', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    await assertFails(aliceDb.collection('corretores').doc('bob').set({
      nome: 'Alice',
      telefone: '123',
      creci: '123',
      cpf: '12345678901',
      role: 'corretor',
      createdAt: testEnv.firestore.FieldValue.serverTimestamp(),
      updatedAt: testEnv.firestore.FieldValue.serverTimestamp(),
    }));
  });

  it('4. Create corretor with role gerente as non-gerente -> DENY', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    await assertFails(aliceDb.collection('corretores').doc('alice').set({
      nome: 'Alice',
      telefone: '123',
      creci: '123',
      cpf: '12345678901',
      role: 'gerente',
      createdAt: testEnv.firestore.FieldValue.serverTimestamp(),
      updatedAt: testEnv.firestore.FieldValue.serverTimestamp(),
    }));
  });

  it('5. Update own role to gerente -> DENY', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('corretores').doc('alice').set({
        nome: 'Alice',
        telefone: '123',
        creci: '123',
        cpf: '12345678901',
        role: 'corretor',
        createdAt: testEnv.firestore.FieldValue.serverTimestamp(),
        updatedAt: testEnv.firestore.FieldValue.serverTimestamp(),
      });
    });

    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    await assertFails(aliceDb.collection('corretores').doc('alice').update({
      role: 'gerente',
      updatedAt: testEnv.firestore.FieldValue.serverTimestamp(),
    }));
  });

  it('6. Read another corretors profile as non-gerente -> DENY', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    await assertFails(aliceDb.collection('corretores').doc('bob').get());
  });

  it('7. List visitas without filter as non-gerente -> DENY', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    // In firestore rules, listing without satisfying the resource.data.corretorId == request.auth.uid fails.
    // Actually, `allow list: if existing().corretorId == request.auth.uid` would mean we can only list with `where('corretorId', '==', 'alice')`.
    // Let's test a blanket list.
    await assertFails(aliceDb.collection('visitas').get());
  });

  it('8. Create visita for another corretorId -> DENY', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    await assertFails(aliceDb.collection('visitas').doc('v1').set({
      corretorId: 'bob',
      visitanteNome: 'A',
      visitanteTelefone: '123',
      descricao: 'B',
      dataVisita: 'C',
      empreendimento: 'Insigna Península',
      createdAt: testEnv.firestore.FieldValue.serverTimestamp(),
      updatedAt: testEnv.firestore.FieldValue.serverTimestamp(),
    }));
  });

  it('9. Update visita to change corretorId -> DENY', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('visitas').doc('v1').set({
        corretorId: 'alice',
        visitanteNome: 'A',
        visitanteTelefone: '123',
        descricao: 'B',
        dataVisita: 'C',
        empreendimento: 'Insigna Península',
        createdAt: testEnv.firestore.FieldValue.serverTimestamp(),
        updatedAt: testEnv.firestore.FieldValue.serverTimestamp(),
      });
    });

    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    await assertFails(aliceDb.collection('visitas').doc('v1').update({
      corretorId: 'bob',
      updatedAt: testEnv.firestore.FieldValue.serverTimestamp(),
    }));
  });

  it('10. Update visita of another corretor -> DENY', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection('visitas').doc('v1').set({
        corretorId: 'bob',
        visitanteNome: 'A',
        visitanteTelefone: '123',
        descricao: 'B',
        dataVisita: 'C',
        empreendimento: 'Insigna Península',
        createdAt: testEnv.firestore.FieldValue.serverTimestamp(),
        updatedAt: testEnv.firestore.FieldValue.serverTimestamp(),
      });
    });

    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    await assertFails(aliceDb.collection('visitas').doc('v1').update({
      descricao: 'Hacked',
      updatedAt: testEnv.firestore.FieldValue.serverTimestamp(),
    }));
  });

  it('11. Missing required field on visita create -> DENY', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    await assertFails(aliceDb.collection('visitas').doc('v1').set({
      corretorId: 'alice',
      // missing visitanteNome
      visitanteTelefone: '123',
      descricao: 'B',
      dataVisita: 'C',
      empreendimento: 'Insigna Península',
      createdAt: testEnv.firestore.FieldValue.serverTimestamp(),
      updatedAt: testEnv.firestore.FieldValue.serverTimestamp(),
    }));
  });

  it('12. Invalid empreendimento enum value -> DENY', async () => {
    const aliceDb = testEnv.authenticatedContext('alice').firestore();
    await assertFails(aliceDb.collection('visitas').doc('v1').set({
      corretorId: 'alice',
      visitanteNome: 'A',
      visitanteTelefone: '123',
      descricao: 'B',
      dataVisita: 'C',
      empreendimento: 'Invalid',
      createdAt: testEnv.firestore.FieldValue.serverTimestamp(),
      updatedAt: testEnv.firestore.FieldValue.serverTimestamp(),
    }));
  });
});
