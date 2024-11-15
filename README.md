# ITrack

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

# Table of contents

- [Pre-requisites]("/itrack?tab=readme-ov-file#pre-requisites")
  - [Installation Procedures]("/itrack?tab=readme-ov-file#installation-procedures)
- [Running the website]("/itrack?tab=readme-ov-file#running-the-website")
  - [Development mode]("/itrack?tab=readme-ov-file#development-mode)
  - [Production mode]("/itrack?tab=readme-ov-file#production-mode)
- [ Setting-up services]("/itrack?tab=readme-ov-file#setting-up-services")
  - [Clerk]("/itrack?tab=readme-ov-file#clerk")
  - [MongoDB]("/itrack?tab=readme-ov-file#mongodb")
  - [uploadthing]("/itrack?tab=readme-ov-file#mongodb")
- [Deployment]("/itrack?tab=readme-ov-file#deployment")
- [Issues]("/itrack?tab=readme-ov-file#issues")

---

# Pre-requisites

- **IDE** eg: ([VS Code](https://code.visualstudio.com/), [Cursor](https://www.cursor.com/))
- [**NodeJS**](https://nodejs.org/en) - JavaScript runtime.
- **Package manager** eg: ([`yarn`](https://yarnpkg.com/), [`pnpm`](https://pnpm.io/), [`npm`](https://www.npmjs.com/)) - managing node pacakges.
- [**GitHub** - for using services.](https://github.com/) - Git repositories (storing source codes).
- [**Clerk** - linked with GitHub account.](https://dashboard.clerk.com/) - Authentication services.
- [**MongoDB** - linked with GitHub account.](https://account.mongodb.com/) - NoSQL Database.
- [**uploadthing** - linked with GitHub account.]("https://uploadthing.com/dashboard") - File storage.
- [**Vercel** - linked with GitHub account.](https://vercel.com/) - used for hosting this NextJS project.

---

#### Procedures

- [Download NodeJS](https://nodejs.org/en), the current node version of this itrack is _v20.17.0_. ![node](/docs/node.jpg)
- There are various package manager for Node, but for itrack we'll use `pnpm`(_Performant Node Package Manager_) as this package manager offers more storage friendly, and faster than `npm`(_Node Package Manager_)
- To proceed we need elevated permission in Windows, you can achieve this in Powershell by [Running as Admin], then paste:

```powershell
  corepack enable pnpm
```

- then run:

```powershell
  corepack use pnpm@latest
```

---

# Running the website

#### Development mode

1. Open this project in your IDE:
   ![vscode](/docs/vscode.jpg)

2. Open the terminal by pressing `CTRL` + **`** which is located below the escape key.
3. Install the package from the `package.json` by typing:

```cmd
  pnpm install
```

4. Set-up your [API keys]("/itrack?tab=readme-ov-file#services-set-up") in your `.env` file, it should look like this **NOTE: DO NOT EXPOSE THIS API KEYS IN PUBLIC** :

![dotenv_like_this](/docs/dotenv_like_this.jpg)

You can include multiple environment in your NextJS project:
![dotenv_multiple_environment](/docs/dotenv_multiple_environment.jpg)

5. Run the application in development mode:

```
  pnpm run dev
```

6. Run in your browser:

```cmd
  http://localhost:3000
```

##### Production mode

1. Make sure you've installed the packages like in the [Running in Development mode's 1-4 steps]("/itrack?tab=readme-ov-file#running-in-development-mode).
2. In your project's terminal run:

```bash
  pnpm run build && pnpm run start
```

3. Run in your browser:

```cmd
  http://localhost:3000
```

---

# Setting-up services

#### Clerk

1. Create your Clerk account by connecting your GitHub account.
2. In Clerk's dashbord, navigate to Configure:
   ![clerk_configure_nav](/docs/clerk_configure_nav.jpg)
3. In the bottom left corner navigate to Developers section then click Api Keys:
   ![clerk_apikeys_nav](/docs/clerk_apikeys_nav.jpg)
4. Copy the env keys, then put it inside your .env file in the root of the project.
   ![clerk_copy_apikeys](/docs/clerk_copy_apikeys.jpg)

#### MongoDB

1. Create your MongoDB account by connecting your GitHub account:
   ![login_mongo](/docs/login_mongo.jpg)
2. Create a Mongo Cluster:
   ![create_cluster_mongo](/docs/create_cluster_mongo.jpg)
3. Wait for the cluster to be made, then hit Connect, follow the options from there onwards, the recommended approach is to connect through `VS Code Mongo extension`.
4. Additionally, to acccess your database you need to configure Network access:
   ![security_mongo](/docs/security_mongo.jpg)
5. MongoDB will automatically add your current IP, just change the xxx.xxx.xxx.NUM/PORT to xxx.xxx.xxx.0/0 because the last digit of your IP address will likely change overtime:
   ![network_access_mongo](/docs/network_access_mongo.jpg)
6. Copy the Mongo connection string into your .env file.

#### uploadthing

1. Create your uploadthing account by connecting your GitHub account.
2. Create a app in uploadthing then navigate to api keys:
   ![uploadthing_apikeys_nav](/docs/uploadthing_apikeys_nav.jpg)
3. Copy the API keys and paste it in your .env file.
   ![uploadthing_copy_env_keys](/docs/uploadthing_copy_env_keys.jpg)

---

# Deployment

There are 2 ways you can deploy this NextJS project, the first one is through [Vercel CLI](https://vercel.com/docs/cli), the other way is to upload this project to `GitHub`, and make sure you have a `Vercel` account.

For this tutorial we will use the deployment through GitHub account.

1. On your Vercel Dashboard navigate to Add New in the top right corner.
   ![adding_to_vercel](/docs/adding_to_vercel.jpg)
2. Select Project.
   ![selecting_project](/docs/selecting_project.jpg)
3. Lastly choose the repository that you've uploaded into GitHub. (For uploading codes in GitHub repository follow this [guide](https://docs.github.com/en/get-started/start-your-journey/uploading-a-project-to-github).)
   ![selecting_your_repository](/docs/selecting_your_repository.jpg)
4. Make sure to set-up your environment variables for [Clerk]("/itrack?tab=readme-ov-file#clerk"), [MongoDB]("/itrack?tab=readme-ov-file#mongodb"), and [uploadthing]("/itrack?tab=readme-ov-file#uploadthing") here:
   ![vercel_env_set_up_nav](/docs/vercel_env_set_up_nav.jpg)
5. Paste the API keys here:
   ![vercel_env_paste](/docs/vercel_env_paste.jpg)

---

# Issues

- ~~Grades of the students in admin stacks, need to bring back `studentNumber` in the mapping of objects.~~
- ~~AuthenticatedRoutes are still accessible when logged out excluding the student dashboard.~~
- ~~Bugs in the certificate calculation due to the inconsistent naming of specialization.~~ _(Fixed by renaming specialization in `/src/lib/certificates.ts` aligning with specialization enum.)_
- ~~TypeError: Promise.withResolvers is not a function in react-pdftotext that is using [react-pdf](https://github.com/mozilla/pdf.js), here the [solutions](https://stackoverflow.com/questions/78415681/pdf-js-pdfjs-dist-promise-withresolvers-is-not-a-function), **TLDR**: _this is due to NodeJS < v22_.~~ _(Resolved with [`pdf2json`](https://github.com/modesty/pdf2json) package.)_
