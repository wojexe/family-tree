import {Person} from "../../src/store/person";
import {createFamilies} from "../../src/store/families";
import type {Family} from "../../src/types/family";
import type {Writable} from "svelte/store";
import {createPeople} from "../../src/store/people";
import {faker} from "@faker-js/faker";


test("createPeople_add_remove", async () => {
    const peopleStore = createPeople();

    let peopleStoreSize = 0;
    peopleStore.subscribe((map) => {
        peopleStoreSize = map.size
    });

    assert.isTrue(peopleStoreSize === 0, "People store size should be 0");

    const data = {
        hash: faker.hacker.ingverb(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };

    await peopleStore.add(data);

    peopleStore.subscribe((map) => {
        peopleStoreSize = map.size
    });
    assert.isTrue(peopleStoreSize === 1, "People store size should be 1");

    let peopleStoreMap = new Map<string, Person>();
    peopleStore.subscribe((map) => {
        peopleStoreMap = map
    });

    const personHash = Object.keys(peopleStoreMap)[0];
    const person = peopleStoreMap.get(personHash);

    assert.isTrue(person?.firstName === data.firstName, "Person should be the same as added");
    assert.isTrue(person?.lastName === data.lastName, "Person should be the same as added");

    if(person === undefined) {
        assert.fail("Person should be defined")
    }

    peopleStore.remove(person);

    peopleStore.subscribe((map) => {
        peopleStoreSize = map.size
    });
    assert.isTrue(peopleStoreSize === 0, "People store size should be 0");
})

test("people_has_positive", async () => {
    const peopleStore = createPeople();

    const personData = {
        hash: faker.hacker.ingverb(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    }

    await peopleStore.add(personData);

    let peopleStoreMap = new Map<string, Person>();
    peopleStore.subscribe((map) => {
        peopleStoreMap = map
    });

    const personHash = Object.keys(peopleStoreMap)[0];
    const person = peopleStoreMap.get(personHash);

    assert.isTrue(peopleStore.has({person, hash: person?.hash}))
})

test("people_has_negative", async () => {
    const peopleStore = createPeople();

    const personData = {
        hash: faker.hacker.ingverb(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    }

    await peopleStore.add(personData);

    let peopleStoreMap = new Map<string, Person>();
    peopleStore.subscribe((map) => {
        peopleStoreMap = map
    });


    assert.isFalse(peopleStore.has({person: undefined, hash: "nope"}))
})

test("people_clear", async () => {
    const peopleStore = createPeople();

    const personData = {
        hash: faker.hacker.ingverb(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    }

    await peopleStore.add(personData);

    let peopleStoreSize;
    peopleStore.subscribe((map) => {
        peopleStoreSize = map.size
    });

    assert.isTrue(peopleStoreSize === 1)

    peopleStore.clear();

    peopleStore.subscribe((map) => {
        peopleStoreSize = map.size
    });

    assert.isTrue(peopleStoreSize === 0)
})
