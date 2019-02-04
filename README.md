# Karavaan - Mobile Application

## Table of Contents  
[Description](#description)

[Branching](#branching)

[Setup](#setup)

[JSON](#json)

[Docs](#docs)

## Description
Latest repository for the course "Mobiele Toepassingen" at the UC Leuven-Limburg.

## Branching
- master -> @prod

- develoment/brecht -> @Brecht
- development/steven -> @Steven
- development/bart -> @Bart


Branches have already been created:
```sh
git checkout -b <branch>
```
You can list all the branch you are currently working on via:
```sh
git branch
```

Push branch to remote origin for it to be tracked:
```sh
git push -u origin <branch>
```

Fetch specific branches via:
```sh
git fetch
git checkout origin/<branch>
```

Pull master into <branch>
```sh
git fetch origin
git checkout master
git merge --ff-only origin/master
git checkout <branch>
git merge --no-ff origin/master
```
  
  Push to <branch>
  ```sh
  git push origin <branch>
  ```


## Setup
- Install Node.js: https://nodejs.org/en/
- Install ionic:

```sh
npm install -g ionic
```

- Start app via:
```sh
ionic start Karavaan tabs
```

- Run the app (in chrome):
```sh
ionic serve
```

- Install ionic storage:
```sh
npm install --save @ionic/storage
```
## JSON
JSON Structure sample can be found in auth.ts


## Docs
- Components overview: https://ionicframework.com/docs/components/#overview
- API: https://ionicframework.com/docs/api/






