import {Person} from "../../src/store/person";
import {faker} from '@faker-js/faker';
import {createFamilies} from "../../src/store/families";


test("person_create", async () => {
    const personData = {
        hash: faker.hacker.verb(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        additionalName: faker.person.middleName(),
        dateOfBirth: {custom: false, date: faker.date.birthdate().toISOString()},
    };

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    assert.equal(personHash, personData.hash, "Hashes are not equal");
    assert.equal(person.firstName, personData.firstName, "Names are not equal");
    assert.equal(person.lastName, personData.lastName, "Last names are not equal");
    assert.equal(person.additionalName, personData.additionalName, "Additional names are not equal");
    assert.deepEqual(person.dateOfBirth, personData.dateOfBirth, "Date of births are not equal");
})

test("person_create_no_hash", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        additionalName: faker.person.middleName(),
        dateOfBirth: {custom: false, date: faker.date.birthdate().toISOString()},
    };

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    assert.isNotNull(personHash, "Hash is null");
    assert.equal(person.firstName, personData.firstName, "Names are not equal");
    assert.equal(person.lastName, personData.lastName, "Last names are not equal");
    assert.equal(person.additionalName, personData.additionalName, "Additional names are not equal");
    assert.deepEqual(person.dateOfBirth, personData.dateOfBirth, "Date of births are not equal")
});

test("person_firstName", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        additionalName: faker.person.middleName(),
        dateOfBirth: {custom: false, date: faker.date.birthdate().toISOString()},
    };

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    assert.equal(person.firstName, personData.firstName, "Names are not equal");

    const changedFirstName = faker.person.firstName();
    person.firstName = changedFirstName;
    assert.equal(person.firstName, changedFirstName, "Names are not equal");
});

test("person_lastName", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        additionalName: faker.person.middleName(),
        dateOfBirth: {custom: false, date: faker.date.birthdate().toISOString()},
    }

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    assert.equal(person.lastName, personData.lastName, "Last names are not equal");

    const changedLastName = faker.person.lastName();
    person.lastName = changedLastName;
    assert.equal(person.lastName, changedLastName, "Last names are not equal");
})

test("person_additionalName", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        additionalName: faker.person.middleName(),
        dateOfBirth: {custom: false, date: faker.date.birthdate().toISOString()},
    }

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    assert.equal(person.additionalName, personData.additionalName, "Additional names are not equal");

    const changedAdditionalName = faker.person.middleName();
    person.additionalName = changedAdditionalName;
    assert.equal(person.additionalName, changedAdditionalName, "Additional names are not equal");
});

test("person_familyName", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        familyName: faker.name.lastName(),
        dateOfBirth: {custom: false, date: faker.date.birthdate().toISOString()},
    }

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    assert.equal(person.familyName, personData.familyName, "Family names are not equal");

    const changedFamilyName = faker.name.lastName();
    person.familyName = changedFamilyName;
    assert.equal(person.familyName, changedFamilyName, "Family names are not equal");
})

test("person_dateOfBirth", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dateOfBirth: {custom: false, date: faker.date.birthdate().toISOString()},
    }

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    assert.deepEqual(person.dateOfBirth, personData.dateOfBirth, "Date of births are not equal");

    const changedDateOfBirth = {custom: true, date: faker.date.past().toISOString()};
    person.dateOfBirth = changedDateOfBirth;
    assert.deepEqual(person.dateOfBirth, changedDateOfBirth, "Date of births are not equal");
})
// test should look like the previous one for the getters and setter

test("person_dateOfDeath", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dateOfDeath: {custom: false, date: faker.date.past().toISOString()},
    }

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    assert.deepEqual(person.dateOfDeath, personData.dateOfDeath, "Date of deaths are not equal");

    const changedDateOfDeath = {custom: true, date: faker.date.past().toISOString()};
    person.dateOfDeath = changedDateOfDeath;
    assert.deepEqual(person.dateOfDeath, changedDateOfDeath, "Date of deaths are not equal");
})

test("person_dateOfDeath_earlier_than_dateOfBirth", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dateOfBirth: {custom: false, date: faker.date.recent().toISOString()},
        dateOfDeath: {custom: false, date: faker.date.future({years: 100}).toISOString()},
    }

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;

    assert.throws(async () => (await personGenerator.next()).value, Error, undefined, "Date of death is earlier than date of birth");
})

test("person_dateOfDeath_later_than_today", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dateOfBirth: {custom: false, date: faker.date.past().toISOString()},
        dateOfDeath: {custom: false, date: faker.date.future().toISOString()},
    }

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;

    assert.throws(async () => (await personGenerator.next()).value, Error, undefined, "Date of death is later than today");
})

test("person_dateOfBirth_later_than_today", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dateOfBirth: {custom: false, date: faker.date.future().toISOString()},
    }

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;

    assert.throws(async () => (await personGenerator.next()).value, Error, undefined, "Date of birth is later than today");
})

test("person_marriageHash", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    }

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    const marriagePersonData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        marriedWith: personHash,
    }

    const marriagePersonGenerator = Person.create(marriagePersonData);
    const marriagePersonHash = (await marriagePersonGenerator.next()).value as string;
    const marriagePerson = (await marriagePersonGenerator.next()).value as Person;

    assert.equal(person.marriageHash, marriagePersonHash, "Marriage hashes are not equal");
})

test("person_marry", async () => {
    const personData1 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };

    const personData2 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };

    const personGenerator1 = Person.create(personData1);
    const personGenerator2 = Person.create(personData2);

    await personGenerator1.next();
    await personGenerator2.next();
    const person1 = (await personGenerator1.next()).value as Person;
    const person2 = (await personGenerator2.next()).value as Person;

    person1.marry(person2);

    assert.equal(person1.marriedWith, person2, "Married person is not equal");
    assert.equal(person2.marriedWith, person1, "Married person is not equal");
});

test("person_marry_already_married", async () => {
    const personData1 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };

    const personData2 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };

    const personData3 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };

    const personGenerator1 = Person.create(personData1);
    const personGenerator2 = Person.create(personData2);
    const personGenerator3 = Person.create(personData3);

    await personGenerator1.next();
    await personGenerator2.next();
    await personGenerator3.next();

    const person1 = (await personGenerator1.next()).value as Person;
    const person2 = (await personGenerator2.next()).value as Person;
    const person3 = (await personGenerator3.next()).value as Person;

    person1.marry(person2);

    assert.throws(() => person1.marry(person3), Error, undefined,"Person is already married");
});

test("person_getFullNameAbbr", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        additionalName: faker.person.middleName(),
        lastName: faker.person.lastName(),
        familyName: faker.name.lastName(),
        dateOfBirth: {custom: false, date: faker.date.birthdate().toISOString()},
    }

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    const expectedFullNameAbbr = `${personData.firstName.charAt(0)}. ${
        personData.additionalName != null ? `${personData.additionalName.charAt(0)}. ` : ""
    }${personData.lastName}${personData.familyName != null ? ` - ${personData.familyName}` : ""}`;

    assert.equal(person.getFullNameAbbr(), expectedFullNameAbbr, "Full name abbreviations are not equal");
})

test("person_getFullName", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        additionalName: faker.person.middleName(),
        lastName: faker.person.lastName(),
        familyName: faker.name.lastName(),
        dateOfBirth: {custom: false, date: faker.date.birthdate().toISOString()},
    }

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    const expectedFullName = `${personData.firstName} ${
        personData.additionalName != null ? `${personData.additionalName} ` : ""
    }${personData.lastName}${personData.familyName != null ? ` - ${personData.familyName}` : ""}`;

    assert.equal(person.getFullName(), expectedFullName, "Full names are not equal");
})

test("person_divorce", async () => {
    const personData1 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };

    const personData2 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };

    const personGenerator1 = Person.create(personData1);
    const personGenerator2 = Person.create(personData2);

    await personGenerator1.next();
    await personGenerator2.next();

    const person1 = (await personGenerator1.next()).value as Person;
    const person2 = (await personGenerator2.next()).value as Person;

    person1.marry(person2);
    person1.divorce();

    assert.isNull(person1.marriedWith, "Married person is not null");
    assert.isNull(person2.marriedWith, "Married person is not null");
});

test("person_divorce_not_married", async () => {
    const personData1 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };

    const personGenerator1 = Person.create(personData1);

    await personGenerator1.next();

    const person1 = (await personGenerator1.next()).value as Person;

    assert.throws(() => person1.divorce(), Error, undefined, "Person is not married");
})

test("person_edit", async () => {
    const personData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        additionalName: faker.person.middleName(),
        dateOfBirth: {custom: false, date: faker.date.birthdate().toISOString()},
    };

    const personGenerator = Person.create(personData);
    const personHash = (await personGenerator.next()).value as string;
    const person = (await personGenerator.next()).value as Person;

    const edits = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        additionalName: faker.person.middleName(),
        dateOfBirth: {custom: false, date: faker.date.birthdate().toISOString()},
    };

    person.edit(edits);

    assert.equal(person.firstName, edits.firstName, "Edited first name is not equal");
    assert.equal(person.lastName, edits.lastName, "Edited last name is not equal");
    assert.equal(person.additionalName, edits.additionalName, "Edited additional name is not equal");
    assert.deepEqual(person.dateOfBirth, edits.dateOfBirth, "Edited date of birth is not equal");
});

test("person_remove_child", async () => {
    const familyStore = createFamilies();

    const personData1 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };

    const personData2 = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
    };

    const personGenerator1 = Person.create(personData1);
    const personGenerator2 = Person.create(personData2);

    await personGenerator1.next();
    await personGenerator2.next();

    const person1 = (await personGenerator1.next()).value as Person;
    const person2 = (await personGenerator2.next()).value as Person;

    person1.marry(person2);
    const childData = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        childOf: person1.marriageHash,
    };

    const childGenerator = Person.create(childData);
    const childHash = (await childGenerator.next()).value as string;
    const child = (await childGenerator.next()).value as Person;


    familyStore.add(person1, person2);
    familyStore.addChild(child);

    assert.isTrue(familyStore.has({person: child, hash: childHash}), "Child was not added");

    child.remove();

    assert.isFalse(familyStore.has({person: child, hash: childHash}), "Child was not removed");
})
