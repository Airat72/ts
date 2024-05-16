// РАЗМИНКА

interface User {
    id: number;
    name: string;
    email: string;
}


interface Activity {
    userId: number;
    activity: string; 
    timestamp: Date;
}


async function fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Проблема с запросом: ' + response.statusText);
    }
    return await response.json() as T;
  }

fetchData<User>('https://example.com/users/1')
  .then(user => {
    console.log(user.id, user.name, user.email);
  })
  .catch(error => {
    console.error(error);
  });

  type PartiaUser = Partial<User>;

  type ReadonlyActivity  =  Readonly<Activity>;

  function getUserActivities(userId: number): Promise<Activity[]> {
    return fetchData(`/api/activities/${userId}`);
  } 

  type ActivitiesReturnType = ReturnType<typeof getUserActivities>;

  type AdminPermissions = { canBanUser: boolean };
  type BasicPermissions = { canEditProfile: boolean };


  type PermissionsDispatcher<T> = T extends "admin" ? AdminPermissions : BasicPermissions;

  let adminPermissions: PermissionsDispatcher<"admin">; 
  let basicPermissions: PermissionsDispatcher<"basic">; 



//   ЧАСТЬ 2


type StringOrNumber = string | number;

function logMessage(message: StringOrNumber): void {
    console.log(message);
  }


  function throwError(errorMsg: string): never {
    throw new Error(errorMsg);
  }  

  function isString(value: any): value is string {
    return typeof value === 'string';
  }

  function assertIsNumber(value: any): asserts value is number {
    if (typeof value !== 'number') {
      throw new Error('Value is not a number');
    }
  }

function logValue(value: StringOrNumber) {
  console.log(value);
}

logValue('строка');
logValue(42);


function processValue(value: StringOrNumber) {
  if (isString(value)) {
    //  это строка
    console.log(`String value: ${value.toUpperCase()}`);
  } else {
    //  утверждаем, что это число
    assertIsNumber(value);
    //  это число
    console.log(`Number value: ${value.toFixed(2)}`);
  }
}


// Задание 2


// interface Response <T> {
//     readonly    data: T;
//     readonly  status: number;
//   }


// interface Response<T> {
//   data: T;
//   status: number;
// }

// function createResponse<T>(data: T, status: number): Response<T> {
//   return { data, status };
// }



// Задание 3: Расширенное использование Generics

type Carrs = {
  company: string;
  model: string;
  year: number;
};

type Bike = {
  make: any;
  company: string;
  type: 'road' | 'mountain';
};


type Cars = {
  make: string;
  model: string;
  year: number;
  type: 'car';
};

function isCar(vehicle: any): vehicle is Car {
  return (
    typeof vehicle === 'object' &&
    vehicle !== null &&
    'make' in vehicle &&
    'model' in vehicle &&
    'year' in vehicle &&
    'type' in vehicle &&
    vehicle.type === 'car'
  );
}


type Car = {
  make: string;
  model: string;
  year: number;
};

type Bikes = {
  make: string;
  type: 'road' | 'mountain';
};

function isCas(vehicle: any): vehicle is Car {
  return 'make' in vehicle && 'model' in vehicle && 'year' in vehicle;
}

function printVehicleInfo(vehicle: Car | Bike) {
  if (isCar(vehicle)) {
    console.log(`Car: ${vehicle.make} ${vehicle.model} ${vehicle.year}`);
  } else {
    console.log(`Bike: ${vehicle.make} ${vehicle.type}`);
  }
}



// Задание 4: Использование Utility Types для работы с интерфейсами



interface Employee {
  id: number;
  name: string;
  department: string;
  email: string;
}

// `id`: идентификатор сотрудника.
// `name`:  имя сотрудника.
// `department`:  отдел, в котором работает сотрудник.
// `email`: электронная почта сотрудника.


type PartialEmployee = Partial<Employee>;

type ReadonlyEmployee = Readonly<Employee>;

function printEmployeeInfo(employee: PartialEmployee) {
  console.log(`ID: ${employee.id || 'не указан'}`);
  console.log(`Имя: ${employee.name || 'не указано'}`);
  console.log(`Отдел: ${employee.department || 'не указан'}`);
  console.log(`Email: ${employee.email || 'не указан'}`);
}

//Задание 5: Работа с Indexed Access Types и Mapped Types

interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

type UserNameAndAge = User['name' | 'age']; // { name: string, age: number }

type UserNameType = User['name'];

type UserFieldsToBoolean = {
  [Key in keyof User]: boolean;
};

type UserFieldsToBooleans = {
  id: boolean;
  name: boolean;
  email: boolean;
  age: boolean;
};

function getUserFieldType(key: keyof User): string {
  const user: User = { id: 1, name: 'John Doe', email: 'john@example.com', age: 30, };
  return typeof user[key];
}

console.log(getUserFieldType('name')); // Выведет: "string"
console.log(getUserFieldType('age')); // Выведет: "number"

interface User {
  name: string;
  age: number;
}

function getUserFieldTypes(key: keyof User): string {
  switch (key) {
    case 'name':
      return 'string';
    case 'age':
      return 'number';
    default:
      return 'unknown';
  }
}

const ageType = getUserFieldType('age');
const nameType = getUserFieldType('name');

console.log(ageType); // Выведет: 'number'
console.log(nameType); // Выведет: 'string'

// Задание 6: Расширение и ограничение Generics


interface Identifiable {
  id: number;
}


function findById<T extends Identifiable>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

interface User extends Identifiable {
  name: string;
  email: string;
  age: number;
}

const users: User[] = [
  { id: 1, name: "Alice", email: "alice@example.com", age: 25 },
  { id: 2, name: "Bob", email: "bob@example.com", age: 30 }
];

const user = findById(users, 1);

// Задание 7: Работа с обобщённой функцией поиска в массиве

function findInArray<T>(items: T[], keysAndValues: [keyof T, T[keyof T]][]): T | undefined {
  for (const [key, value] of keysAndValues) {
    const foundItem = items.find(item => item[key] === value);
    if (foundItem) {
      return foundItem;
    }
  }
  return undefined;
}

const userrs: User[] = [
  {
    id: 1, name: "Alice", age: 25,
    email: ""
  },
  {
    id: 2, name: "Bob", age: 30,
    email: ""
  }
];

const products: Product[] = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Smartphone", price: 500 }
];

const books: Books[] = [
  { isbn: "12345", title: "The TypeScript Handbook", author: "Someone" },
  { isbn: "67890", title: "Learning TypeScript", author: "Another One" }
];

// 1. Найдите пользователя по имени "Alice".
const foundUser = users.find(user => user.name === "Alice");

// 2. Найдите продукт с ценой 500.
const foundProduct = products.find(product => product.price === 500);

// 3. Найдите книгу по автору "Another One".
const foundBook = books.find(book => book.author === "Another One");


// Задание 8: Реализация обобщённой функции для сопоставления и преобразования элементов массива


function mapAndFilter<T, U>(items: T[], transform: (item: T) => U, filter: (item: U) => boolean): U[] {
  return items.map(transform).filter(filter);
}

