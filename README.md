# 4ire Solidity School 4.0 Investment Pool Project 
## Student: Volodymyr Horin (v.horin@4irelabs.com)


## Overview

### Requirements

 - [NodeJS](https://nodejs.org/) v12.21.0 or later
 - [Truffle](https://www.trufflesuite.com/) v5.4.1 or later
 - [Yarn](https://yarnpkg.com/) v1.22.10 or later

### Build & Deploy Contracts

1) Install dependencies:
```
yarn install
```

2) Copy `.env.example` -> `.env` and fill all variables. 
   
3) Compile and Deploy contracts to Rinkeby
```
truffle migrate --network=rinkeby
```

### Local Development

1) Install dependencies: 
```
yarn install
```

2) Install and Run Ganache CLI:
```
yarn global add ganache-cli
```
```
ganache-cli
```

3) Copy `.env.example` -> `.env` and fill all variables.
   
4) Compile and Deploy contracts locally
```
truffle migrate --network=development
```

### Testing
1) Install dependencies:
```
yarn install
```

2) Run tests:
```
truffle test
```

2) Check test coverage:
```
truffle run coverage
```
