// interface Person {
//   hash?: string;
//   firstName: string;
//   additionalName?: string;
//   lastName: string;
//   familyName?: string;
//   dateOfBirth?: { custom: boolean; date: string };
//   dateOfDeath?: { custom: boolean; date: string };
//   marriedWith?: string;
//   // marriageHash?: string;
//   childOf?: string;
// }

interface PersonForm {
  hash?: string;

  firstName: string;
  lastName: string;

  additionalName?: string;
  familyName?: string;
  dateOfBirth?: { custom: boolean; date: string };
  dateOfDeath?: { custom: boolean; date: string };

  marriedWith?: string;
  childOf?: string;
}
