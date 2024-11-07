# Installation:

- Download [NodeJS](https://nodejs.org/en).
  ![node](/docs/node.jpg)
- Run the following command in Powershell [Run as Admin]:

```powershell
  corepack enable pnpm
```

then run:

```powershell
  corepack use pnpm@latest
```

- After installing `NodeJS` and the `pnpm`:, open this project in VS Code:
  ![vscode](/docs/vscode.jpg)

- Open the terminal by pressing `CTRL` + `.
- ` is located below escape key.
- Install the package by typing:

```cmd
  pnpm install
```

- Run the application in development mode:

```
  pnpm run dev
```

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

# TODO:

- Disable interactivity when authenticating.
- Admin and Student logs.
- Admin monitoring.
- Maybe Student COR upload for double checking of Student Number.
- Seamless integration of charts.
- Frontend.

There are 3 modules for computation for the students.

- Grades - 25%
  - Calculation for the grades:
    - a = 50%
    - b = 30%
    - c = 20%
- Certificates - 25%
  - Calculation for certificates:
    - a = 3
    - b = 2
    - c = 1
  - If the student has taken the certificate needed for the Job, it will be automatically placed in the result.
- Internship - 50%
  - Calculation for internship:
    - Grade = 33.33%
    - Tasks = 33.33%, if there's no task performed by the student, this will result to 0, else 100.
    - Type of Company = 33.33%, If not IT Company the result will be 0, else 100.

These 3 modules will have a breakdown of the Jobs well suited for the students.

---

# Issues:

- Grades of the students in admin stacks, need to bring back `studentNumber` in the mapping of objects.
- AuthenticatedRoutes are still accessible when logged out excluding the student dashboard.
- ~~Bugs in the certificate calculation due to the inconsistent naming of specialization.~~ _(Fixed by renaming specialization in `/src/lib/certificates.ts` aligning with specialization enum.)_
- ~~TypeError: Promise.withResolvers is not a function in react-pdftotext that is using [react-pdf](https://github.com/mozilla/pdf.js), here the [solutions](https://stackoverflow.com/questions/78415681/pdf-js-pdfjs-dist-promise-withresolvers-is-not-a-function), **TLDR**: _this is due to NodeJS < v22_.~~ _(Resolved with [`pdf2json`](https://github.com/modesty/pdf2json) package.)_
