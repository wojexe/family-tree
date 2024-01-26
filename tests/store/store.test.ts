import {importTree, resetStore} from "../../src/store/store";
import type {Writable} from "svelte/store";
import {createPeople} from "../../src/store/people";
import {createFamilies} from "../../src/store/families";
import {createNotifications} from "../../src/store/notifications";
import {faker} from "@faker-js/faker";
import {Person} from "../../src/store/person";

vi.mock("@macfja/svelte-persistent-store", async (importOriginal) => {
    const actual = await importOriginal() as any;

    return {
        ...actual,
        addSerializableClass: (_: any) => {
        },
        createLocalStorage: (_: any) => {
        },
        persist: (store: any, _storage: any, _key: any) => store,
    }
})

vi.mock('svelte/store', async (importOriginal) => {
    const actual = await importOriginal() as any;

    const writable = actual.writable as Writable<unknown>;

    // HACK: all writable stores are maps currently
    writable.delete = () => {
        writable.set(new Map())
    }

    return {...actual, writable}
})

test("store_resetStore", async () => {
    const peopleStore = createPeople();
    const familiesStore = createFamilies();
    const notificationsStore = createNotifications();

    const person1Data = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    }

    const person2Data = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    }

    const person1Generator = Person.create(person1Data);
    const person1Hash = (await person1Generator.next()).value as string;
    const person1 = (await person1Generator.next()).value as Person;

    const person2Generator = Person.create(person2Data);
    const person2Hash = (await person2Generator.next()).value as string;
    const person2 = (await person2Generator.next()).value as Person;

    let peopleStoreSize = 0;
    peopleStore.subscribe((map) => {
        peopleStoreSize = map.size
    });
    assert.isTrue(peopleStoreSize === 0, "People store size should be 0");

    await peopleStore.add(person1);
    await peopleStore.add(person2);
    peopleStore.subscribe((map) => {
        peopleStoreSize = map.size
    });
    assert.isTrue(peopleStoreSize === 2, "People store size should be 2");

    let familiesStoreSize = 0;
    familiesStore.subscribe((map) => {
        familiesStoreSize = map.size
    });
    assert.isTrue(familiesStoreSize === 0, "Families store size should be 0");

    familiesStore.add(person1, person2);
    familiesStore.subscribe((map) => {
        familiesStoreSize = map.size
    });
    assert.isTrue(familiesStoreSize === 1, "Families store size should be 1");

    let notificationsStoreSize = 0;
    notificationsStore.subscribe((map) => {
        notificationsStoreSize = map.size
    });
    assert.isTrue(notificationsStoreSize === 0, "Notifications store size should be 0");

    notificationsStore.sendInfo("Test message");

    notificationsStore.subscribe((map) => {
        notificationsStoreSize = map.size
    });
    assert.isTrue(notificationsStoreSize === 1, "Notifications store size should be 1");

    resetStore();

    peopleStore.subscribe((map) => {
        peopleStoreSize = map.size
    });
    assert.isTrue(peopleStoreSize === 0, "People store size should be 0");

    familiesStore.subscribe((map) => {
        familiesStoreSize = map.size
    });
    assert.isTrue(familiesStoreSize === 0, "Families store size should be 0");

    notificationsStore.subscribe((map) => {
        notificationsStoreSize = map.size
    });
    assert.isTrue(notificationsStoreSize === 0, "Notifications store size should be 2");
});