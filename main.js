const maleNames = [
  "Jan","Petr","Martin","Tomáš","Lukáš","Jakub","David","Ondřej","Marek","Jiří",
  "Michal","Filip","Adam","Matěj","Dominik","Vojtěch","Daniel","Radek","Karel","Roman",
  "Josef","Stanislav","Aleš","Jaroslav","Zdeněk","Patrik","Václav","Libor","Oldřich","Bohumil",
  "Rostislav","Ivo","Miloslav","Štěpán","Hynek","Vilém","Bedřich","Igor","Dalibor","Svatopluk",
  "Leoš","Vlastimil","Emil","Otakar","Radim","Luboš","Břetislav","Čestmír","Prokop","Arnošt"
];

const femaleNames = [
  "Jana","Petra","Martina","Tereza","Lucie","Kateřina","Veronika","Lenka","Eva","Anna",
  "Barbora","Nikola","Adéla","Karolína","Kristýna","Denisa","Simona","Hana","Alena","Ivana",
  "Markéta","Monika","Eliška","Magdalena","Michaela","Klára","Dagmar","Blanka","Radka","Pavla",
  "Zuzana","Renata","Soňa","Šárka","Vendula","Ilona","Gabriela","Olga","Milena","Jitka",
  "Božena","Libuše","Růžena","Věra","Ludmila","Běla","Anežka","Květa","Vlasta","Emílie"
];

const maleSurnames = [
  "Novák","Svoboda","Novotný","Dvořák","Černý","Procházka","Kučera","Veselý","Horák","Němec",
  "Marek","Pokorný","Pospíšil","Hájek","Jelínek","Král","Růžička","Beneš","Fiala","Sedláček",
  "Doležal","Zeman","Kolář","Navrátil","Čech","Urban","Bartoš","Vaněk","Kopecký","Krejčí",
  "Kratochvíl","Tichý","Šimek","Soukup","Bláha","Kříž","Kohout","Holub","Staněk",
  "Kadlec","Beran","Zajíček","Kolařík","Matoušek","Šťastný","Dušek","Vlček","Pavlík","Moravec"
];

const femaleSurnames = [
  "Nováková","Svobodová","Novotná","Dvořáková","Černá","Procházková","Kučerová","Veselá","Horáková","Němcová",
  "Marková","Pokorná","Pospíšilová","Hájková","Jelínková","Králová","Růžičková","Benešová","Fialová","Sedláčková",
  "Doležalová","Zemanová","Kolářová","Navrátilová","Čechová","Urbanová","Bartošová","Vaňková","Kopecká","Krejčíková",
  "Kratochvílová","Tichá","Šimková","Soukupová","Bláhová","Křížová","Kohoutová","Holubová","Staňková",
  "Kadlecová","Beranová","Zajíčková","Kolaříková","Matoušková","Šťastná","Dušková","Vlčková","Pavlíková","Moravcová"
];

const workloadOptions = [10, 20, 30, 40];

/**
 * Returns a random element from the given array.
 * @param {Array} arr - given array to choose item from
 * @returns {*} random element from given array
 */
function randomArrayItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns a random integer between min and max (inclusive).
 * @param {number} min - minimum value
 * @param {number} max - maximum value
 * @returns {number} random integer
 */
function randomIntNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random birthdate as an ISO string for a person
 * whose age falls within the given range.
 * @param {number} minAge - minimum age in years
 * @param {number} maxAge - maximum age in years
 * @param {Set} usedDates - set of already used birthdated to prevent repetitions

 * @returns {string} birthdate in ISO Date-Time format (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
function generateBirthdate(minAge, maxAge, usedDates) {
  const currentYear = new Date().getFullYear();

  const birthYear = randomIntNum(currentYear - maxAge + 1, currentYear - minAge - 1);
  const birthMonth = randomIntNum(0, 11);
  const daysInMonth = new Date(birthYear, birthMonth + 1, 0).getDate();
  const birthDay = randomIntNum(1, daysInMonth);

  const birthdate = new Date(Date.UTC(birthYear, birthMonth, birthDay)).toISOString();

  if (usedDates.has(birthdate)) {
    return generateBirthdate(minAge, maxAge, usedDates);
  }

  usedDates.add(birthdate);
  return birthdate;
}

/**
 * Generates a single employee object with random attributes.
 * @param {number} minAge - minimum age in years
 * @param {number} maxAge - maximum age in years
 * @returns {{ gender: string, birthdate: string, name: string, surname: string, workload: number }} 
 * an object containing the employee's data in the specified format
 */
function generateEmployee(minAge, maxAge, usedDates) {
  const gender = (Math.random() < 0.5) ? "male" : "female";
  const name = (gender === "male") ? randomArrayItem(maleNames) : randomArrayItem(femaleNames);
  const surname = (gender === "male") ? randomArrayItem(maleSurnames) : randomArrayItem(femaleSurnames);
  const birthdate = generateBirthdate(minAge, maxAge, usedDates);
  const workload = randomArrayItem(workloadOptions);

  return { gender, birthdate, name, surname, workload };
}

/**
 * Calculates current age as a decimal number from ISO birthdate string.
 * @param {string} birthdate - ISO 8601 date string (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @returns {number} age in years with decimal precision
 */
function getAge(birthdate) {
  const today = new Date();
  const birth = new Date(birthdate);
  const diffMs = today - birth;
  return diffMs / (1000 * 60 * 60 * 24 * 365.25);
}


/**
 * Calculates age statistics from the employee list.
 * @param {Array} employees - list of generated employees
 * @param {number} count - total number of employees
 * @returns {{ min_age: number, max_age: number, average_age: number, median_age: number }}
 */
function getAgeStatistics(employees, count){
  let ages_list = [];
  let min_age = Infinity;
  let max_age = -Infinity;

  let current_age;
  let ages_sum = 0;
  for (let i = 0; i < count; i++){
    current_age = getAge(employees[i].birthdate);
    ages_list.push(current_age);
    if (min_age > current_age) min_age = current_age;
    if (max_age < current_age) max_age = current_age;
    ages_sum += current_age;
  }

const average_age = ages_sum / count;

ages_list.sort((a,b) => a - b);
const mid = Math.floor(count / 2);
const median_age = count % 2 !== 0 
  ? ages_list[mid] 
  : (ages_list[mid - 1] + ages_list[mid]) / 2;  


return {min_age, max_age, average_age, median_age}
}

/**
 * Calculates workload statistics from the employee list.
 * Counts employees per workload level, calculates median workload
 * and average workload among female employees.
 * @param {Array} employees - list of generated employees
 * @returns {{ countByWorkload: object, medianWorkload: number, averageWomenWorkload: number|null }}
 */
function getWorkloadStatistics(employees){
  const countByWorkload = { 10: 0, 20: 0, 30: 0, 40: 0 };
  let femaleTotalWorkload = 0;
  let femaleCount = 0;
  let workloads = [];

  for (const employee of employees) {
    countByWorkload[employee.workload]++;
    workloads.push(employee.workload);
    if (employee.gender === "female") {
      femaleTotalWorkload += employee.workload;
      femaleCount++;
    }
  }

  workloads.sort((a, b) => a - b);
  const mid = Math.floor(workloads.length / 2);
  const medianWorkload = workloads.length % 2 !== 0
    ? workloads[mid]
    : (workloads[mid - 1] + workloads[mid]) / 2;

  const averageWomenWorkload = femaleCount > 0
    ? parseFloat((femaleTotalWorkload / femaleCount).toFixed(1))
    : null;

  return { countByWorkload, medianWorkload, averageWomenWorkload };
}

/**
 * Calculates statistics from the generated employee list.
 * @param {Array} employees - list of generated employees
 * @returns {object} statistics object matching dtoOut structure
 */
export function getEmployeeStatistics(employees) {
  const count = employees.length;

  const ageStats = getAgeStatistics(employees, count);
  const workloadStats = getWorkloadStatistics(employees);

  const sortedByWorkload = [...employees].sort((a, b) => a.workload - b.workload);

  return {
    total: count,
    workload10: workloadStats.countByWorkload[10],
    workload20: workloadStats.countByWorkload[20],
    workload30: workloadStats.countByWorkload[30],
    workload40: workloadStats.countByWorkload[40],
    averageAge: parseFloat(ageStats.average_age.toFixed(1)),
    minAge: Math.floor(ageStats.min_age),
    maxAge: Math.floor(ageStats.max_age),
    medianAge: Math.floor(ageStats.median_age),
    medianWorkload: workloadStats.medianWorkload,
    averageWomenWorkload: workloadStats.averageWomenWorkload,
    sortedByWorkload,
  };
}


/**
 * Generates a list of employees based on input parameters.
 * @param {object} dtoIn - input data
 * @param {number} dtoIn.count - number of employees to generate
 * @param {{ min: number, max: number }} dtoIn.age - age range for generated employees
 * @returns {Array} list of generated employees
 */
export function generateEmployeeData(dtoIn) {
  const { count, age } = dtoIn;
  const usedDates = new Set();
  const employees = [];

  for (let i = 0; i < count; i++) {
    employees.push(generateEmployee(age.min, age.max, usedDates));
  }

  return employees;
}


/**
 * The main function which calls the application.
 * Generates a list of random employees based on the provided input parameters.
 * Each employee has a randomly assigned name, surname, gender, birthdate and workload.
 * @param {object} dtoIn contains count of employees, age limit of employees {min, max}
 * @param {number} dtoIn.count - number of employees to generate
 * @param {{ min: number, max: number }} dtoIn.age - age range for generated employees
 * @returns {Array} of employees
 */
export function main(dtoIn) {
  const { count, age } = dtoIn;

  if (!count || count < 1) throw new Error("count must be a positive number");
  if (!age || age.min == null || age.max == null) throw new Error("age.min and age.max are required");
  if (age.min > age.max) throw new Error("age.min cannot be greater than age.max");

  const employees = generateEmployeeData(dtoIn);
  const dtoOut = getEmployeeStatistics(employees);
  return dtoOut;
}