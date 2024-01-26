import {fa, faker} from "@faker-js/faker";

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

import {Person} from "../../src/store/person";
import {createFamilies} from "../../src/store/families";
import type {Family} from "../../src/types/family";
import type {Writable} from "svelte/store";

test("families_add", async () => {
    const familiesStore = createFamilies();
    let familiesStoreSize = 0;

    familiesStore.subscribe((map) => {
        familiesStoreSize = map.size
    })()

    assert.isTrue(familiesStoreSize === 0, "Families store size should be 0");

    const dataP1 = {
        hash: "person1",
        firstName: "Krzysiek",
        lastName: "Krzysiecki",
    };

    const dataP2 = {
        hash: "person2",
        firstName: "Janina",
        lastName: "Krzysiecka",
        marriedWith: "person1"
    };

    const p1Gen = Person.create(dataP1)
    const p1Hash = (await p1Gen.next()).value as string;
    const person1 = (await (p1Gen.next())).value as Person;

    const p2Gen = Person.create(dataP2);
    const p2Hash = (await p2Gen.next()).value as string;
    const person2 = (await (p2Gen.next())).value as Person;

    familiesStore.add(person1, person2);

    familiesStore.subscribe((map) => {
        familiesStoreSize = map.size
    })()


    const hasPerson1 = familiesStore.has({person: person1, hash: p1Hash})
    const hasPerson2 = familiesStore.has({person: person2, hash: p2Hash})

    assert.isTrue(familiesStoreSize === 1)
    assert.isTrue(hasPerson1)
    assert.isTrue(hasPerson2)
});

test("families_add_same_person", async () => {
    const familiesStore = createFamilies();
    let familiesStoreSize = 0;

    familiesStore.subscribe((map) => {
        familiesStoreSize = map.size
    })()

    assert.isTrue(familiesStoreSize === 0, "Families store size should be 0");

    const dataP1 = {
        hash: "person1",
        firstName: "Krzysiek",
        lastName: "Krzysiecki",
    };

    const p1Gen = Person.create(dataP1)
    const p1Hash = (await p1Gen.next()).value as string;
    const person1 = (await (p1Gen.next())).value as Person;

    assert.throws(() => familiesStore.add(person1, person1), undefined, "Person cannot be married to themselves");
})

test("families_add_remove_child", async () => {
    const familiesStore = createFamilies();
    let familiesStoreSize;

    familiesStore.subscribe((map) => {
        familiesStoreSize = map.size
    })()

    assert.isTrue(familiesStoreSize === 0, "Families store size should be 0");


    const dataP1 = {
        hash: "person1",
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    }

    const dataP2 = {
        hash: "person2",
        firstName: faker.person.firstName(),
        marriedWith: faker.person.lastName(),
    }

    // child of person1 person2
    const dataP3 = {
        hash: "person3",
        firstName: "Wojtek",
        lastName: "Piotrzycki-Wesołowski",
        childOf: "person2"
    }


    const p1Gen = Person.create(dataP1);
    const p1Hash = (await p1Gen.next()).value;
    const p1 = (await p1Gen.next()).value as Person;

    const p2Gen = Person.create(dataP2);
    const p2Hash = (await p2Gen.next()).value;
    const p2 = (await p2Gen.next()).value as Person;

    const p3Gen = Person.create(dataP3);
    const p3Hash = (await p3Gen.next()).value;
    const p3 = (await p3Gen.next()).value as Person;

    familiesStore.add(p1, p2);

    familiesStore.subscribe((map) => {
        familiesStoreSize = map.size
    })()

    assert.isTrue(familiesStoreSize === 1, "Families store size should be 1");

    let childrenArray: Array<string> | undefined = [];
    familiesStore.subscribe((map) => {
        childrenArray = map?.get(p2.marriageHash)?.children
    })()

    // add child
    assert.isTrue(childrenArray?.length === 0, "Families children store size should be 0")
    familiesStore.addChild(p3);

    familiesStore.subscribe((map) => {
        childrenArray = map?.get(p2.marriageHash)?.children
    })()
    assert.isTrue(childrenArray?.length === 1, "Families children store size should be 1")

    familiesStore.removeChild(p2.marriageHash, p3);

    familiesStore.subscribe((map) => {
        childrenArray = map?.get(p2.marriageHash)?.children
    })()
    assert.isTrue(childrenArray?.length === 0, "Child was not deleted as the size should be 0.")
    assert.isFalse(childrenArray?.includes(p3.hash))
})