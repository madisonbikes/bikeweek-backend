# Changelog

## [1.1.2](https://github.com/madisonbikes/bikeweek-backend/compare/bikeweek-backend-v1.1.1...bikeweek-backend-v1.1.2) (2024-05-20)

### Bug Fixes

- blank location name should result in no location in sched ([e8a538d](https://github.com/madisonbikes/bikeweek-backend/commit/e8a538df91dd6f0ea454689c89d0546550ae2024))

## [1.1.1](https://github.com/madisonbikes/bikeweek-backend/compare/bikeweek-backend-v1.1.0...bikeweek-backend-v1.1.1) (2024-05-13)

### Bug Fixes

- bump google-auth-library from 9.7.0 to 9.9.0 ([bb608de](https://github.com/madisonbikes/bikeweek-backend/commit/bb608de740d777375c598c9269b150246cbc7fd4))
- bump pino from 8.19.0 to 9.0.0 ([e9a7ba5](https://github.com/madisonbikes/bikeweek-backend/commit/e9a7ba5c3821c391b66fe9887ffcd33d27d8d486))
- bump superagent from 8.1.2 to 9.0.2 ([980ce40](https://github.com/madisonbikes/bikeweek-backend/commit/980ce401e32f9d9d995a31ddf66ef65f89c1cf5b))
- bump zod from 3.22.4 to 3.23.5 ([905d491](https://github.com/madisonbikes/bikeweek-backend/commit/905d49106b1dbf592af81553153240e24a45080c))
- remove use of tsyringe DI ([4ad2f5a](https://github.com/madisonbikes/bikeweek-backend/commit/4ad2f5a9b34aa5c0a2879f8b0e0c416e6a94454a))
- warning in call to date-fns with DDD ([c67cf7d](https://github.com/madisonbikes/bikeweek-backend/commit/c67cf7d118bbb9d979cfb08d1a8c17f15dadd3fd))

## [1.1.0](https://github.com/madisonbikes/bikeweek-backend/compare/bikeweek-backend-v1.0.0...bikeweek-backend-v1.1.0) (2024-04-04)

### Features

- add version number to api surface ([54474e7](https://github.com/madisonbikes/bikeweek-backend/commit/54474e7c4c5001b0da82dd6d91a7e4c9ec30dfd0))

### Bug Fixes

- bump pino-pretty from 10.3.1 to 11.0.0 ([d8dbcd3](https://github.com/madisonbikes/bikeweek-backend/commit/d8dbcd33989a99155b21245a180806b94f12d8c1))
- bump reflect-metadata from 0.2.1 to 0.2.2 ([a398a63](https://github.com/madisonbikes/bikeweek-backend/commit/a398a63825c7e00cddd172458e53d1ae5bbde495))
- ecosystem config uses wrong startup path ([45d1696](https://github.com/madisonbikes/bikeweek-backend/commit/45d1696d89af704fdf0684183dbaa5f9a75fd983))

## [1.0.0](https://github.com/madisonbikes/bikeweek-backend/compare/bikeweek-backend-v0.4.1...bikeweek-backend-v1.0.0) (2024-03-26)

### Features

- release 1.0 ([a5a66ae](https://github.com/madisonbikes/bikeweek-backend/commit/a5a66ae6f850b51d1868723ec5229433261f76f7))

### Miscellaneous Chores

- release 1.0.0 ([6a372f4](https://github.com/madisonbikes/bikeweek-backend/commit/6a372f4f93296ee003082ff417b56e590e7b2739))

## [0.4.1](https://github.com/madisonbikes/bikeweek-backend/compare/bikeweek-backend-v0.4.0...bikeweek-backend-v0.4.1) (2024-03-26)

### Bug Fixes

- deployment should use node, not ts-node ([1197c1e](https://github.com/madisonbikes/bikeweek-backend/commit/1197c1edd6bdaa953d6ed2a61ec1d9e9193fd638))

## [0.4.0](https://github.com/madisonbikes/bikeweek-backend/compare/bikeweek-backend-v0.3.0...bikeweek-backend-v0.4.0) (2024-03-21)

### Features

- add federated id endpoints + tests ([cbe7628](https://github.com/madisonbikes/bikeweek-backend/commit/cbe7628930fd9d9beade3f75864365053fadd0df))
- add federated login capabilities for google auth ([5ade8cc](https://github.com/madisonbikes/bikeweek-backend/commit/5ade8cccd83f14802094bf2c1c8e587076c748b6))
- add password changing ([de9be46](https://github.com/madisonbikes/bikeweek-backend/commit/de9be46e999a92dff12dc1d2877113043c3eb0d2))
- mask uri passwords when logging ([dd0e11e](https://github.com/madisonbikes/bikeweek-backend/commit/dd0e11ec778141addf5e780d35e5cf9a9b7558ae))
- migrate away from jwt to simple sessions for authentication ([c12885c](https://github.com/madisonbikes/bikeweek-backend/commit/c12885c3ead17d6e5da3eddcb249e016497f801c))
- use pino for logging ([3cb48b7](https://github.com/madisonbikes/bikeweek-backend/commit/3cb48b706ecb7ef187540078c9a52485969c9e1e))

### Bug Fixes

- add better error reporting/handling in server ([afae271](https://github.com/madisonbikes/bikeweek-backend/commit/afae271c51bb8034a8bc2904ef2b9de21f0b49b3))
- add some sched location addresses ([f3e9f12](https://github.com/madisonbikes/bikeweek-backend/commit/f3e9f121455db89a8e1e59a09af348edc3f130dc))
- add type checking for sched export/import ([3eec7c2](https://github.com/madisonbikes/bikeweek-backend/commit/3eec7c2b7e848d4b54da1e2a6831eaa8236b02b1))
- apply lessons learned from past year wrt to typings ([0d8a5fd](https://github.com/madisonbikes/bikeweek-backend/commit/0d8a5fd743f4fd07b64a6d520eb184787bd52609))
- broken semantic release config ([e623c96](https://github.com/madisonbikes/bikeweek-backend/commit/e623c96aa66a1f9e546d282b9a31d7cdd5497f80))
- bump all package versions, preparing for 2023 ([be91afd](https://github.com/madisonbikes/bikeweek-backend/commit/be91afda57ff0ba11687482ff4d761acd4298bb8))
- bump connect-redis from 7.0.1 to 7.1.0 ([eff1a45](https://github.com/madisonbikes/bikeweek-backend/commit/eff1a458f82efe4908cbf2e65278eb1753bf94e6))
- bump connect-redis from 7.1.0 to 7.1.1 ([0ccbefe](https://github.com/madisonbikes/bikeweek-backend/commit/0ccbefe919e8d4a0d2990fe23c16d360b1faa056))
- bump connect-redis to 7.0.1 ([78cd933](https://github.com/madisonbikes/bikeweek-backend/commit/78cd933e70a64c3f2dc244f17c4ae7665b7cb1ff))
- bump connection-string from 4.3.6 to 4.4.0 ([9d10d47](https://github.com/madisonbikes/bikeweek-backend/commit/9d10d4753b27d4d0326929349c36e7ec31f4537c))
- bump date-fns from 2.28.0 to 2.29.1 ([129e379](https://github.com/madisonbikes/bikeweek-backend/commit/129e379ca9129f2a5335d6c0224fc0068a9e293b))
- bump date-fns from 2.29.1 to 2.29.2 ([3c17dd0](https://github.com/madisonbikes/bikeweek-backend/commit/3c17dd00336530f10f13d6d221ea673b68b14e38))
- bump date-fns from 2.29.2 to 2.29.3 ([e177080](https://github.com/madisonbikes/bikeweek-backend/commit/e177080e09ca49c9aba11006e91dafaa0c9c7632))
- bump date-fns from 2.29.3 to 2.30.0 ([6dfe4ad](https://github.com/madisonbikes/bikeweek-backend/commit/6dfe4ad6772e7bc094e1028f04eed07b4b4fb5b4))
- bump date-fns from 2.30.0 to 3.3.1 ([35bf62e](https://github.com/madisonbikes/bikeweek-backend/commit/35bf62e9cf55dd9e1169a58b397aa6ac054a5aa6))
- bump date-fns from 3.3.1 to 3.6.0 ([c1a0e0e](https://github.com/madisonbikes/bikeweek-backend/commit/c1a0e0e5bcb903fc0e57290d85290efd2ed6f215))
- bump dotenv from 16.0.1 to 16.0.2 ([0f69a45](https://github.com/madisonbikes/bikeweek-backend/commit/0f69a45256844310b5f5a16cc988f365513551d1))
- bump dotenv from 16.0.2 to 16.0.3 ([0084a02](https://github.com/madisonbikes/bikeweek-backend/commit/0084a023a7b5484c1382e69496b0c53093be62b7))
- bump dotenv from 16.0.3 to 16.4.1 ([713882c](https://github.com/madisonbikes/bikeweek-backend/commit/713882c7c86a178552c7227e58987307123d9618))
- bump dotenv from 16.4.1 to 16.4.5 ([9ccfb29](https://github.com/madisonbikes/bikeweek-backend/commit/9ccfb294a54af47b00f27afb43c1c8a263b0ec66))
- bump eslint config ([099f267](https://github.com/madisonbikes/bikeweek-backend/commit/099f267a8420243c973f06196815ac82e10c53b8))
- bump express from 4.18.2 to 4.18.3 ([55f0b17](https://github.com/madisonbikes/bikeweek-backend/commit/55f0b17c13a295b42e01303d2b05dc42f0b27081))
- bump express-session and @types/express-session ([00099cf](https://github.com/madisonbikes/bikeweek-backend/commit/00099cf9414b8b57d665523ea6068963c999a227))
- bump google-auth-library from 8.7.0 to 8.8.0 ([2a9d781](https://github.com/madisonbikes/bikeweek-backend/commit/2a9d78171134d982b63cf0c8f362e9374b482f36))
- bump google-auth-library from 8.8.0 to 9.6.1 ([50951fd](https://github.com/madisonbikes/bikeweek-backend/commit/50951fdaa522a6b43774d98283bd1e204ad6f3d0))
- bump google-auth-library from 9.6.1 to 9.6.3 ([7ecc587](https://github.com/madisonbikes/bikeweek-backend/commit/7ecc587aac56698ad8956bddd63febd8cba7390d))
- bump helmet from 5.1.0 to 5.1.1 ([409c925](https://github.com/madisonbikes/bikeweek-backend/commit/409c925cd54c6600e1516ef9b28be20cc411644f))
- bump helmet from 5.1.1 to 6.0.0 ([f8a3ea5](https://github.com/madisonbikes/bikeweek-backend/commit/f8a3ea54df23206d81fe444539388b66819bcee9))
- bump helmet from 6.1.3 to 6.1.5 ([a6c7915](https://github.com/madisonbikes/bikeweek-backend/commit/a6c791515fd6301510cc21bbda1183fc2f7c1fc6))
- bump helmet from 6.1.5 to 7.0.0 ([920838d](https://github.com/madisonbikes/bikeweek-backend/commit/920838db13ad8cda678519516bc97c9321812c44))
- bump helmet from 7.0.0 to 7.1.0 ([b21c3c7](https://github.com/madisonbikes/bikeweek-backend/commit/b21c3c724835e1c72ea67308bd0a2b17151edebc))
- bump http-status-codes from 2.2.0 to 2.3.0 ([6991c73](https://github.com/madisonbikes/bikeweek-backend/commit/6991c735402ef7bb023df29f162964d516c4d722))
- bump mongodb from 4.7.0 to 4.8.1 ([3864147](https://github.com/madisonbikes/bikeweek-backend/commit/386414703ee4a6eb8458d64e6eaeb4af49a5eb0f))
- bump mongodb from 4.9.1 to 4.10.0 ([0695115](https://github.com/madisonbikes/bikeweek-backend/commit/0695115878cc0e434cd7c8930b72c3bc0695bd50))
- bump mongodb from 5.0.1 to 5.1.0 ([577cc55](https://github.com/madisonbikes/bikeweek-backend/commit/577cc55c45525371607e3c1bcf37a3c66ec70f92))
- bump mongodb from 5.1.0 to 5.2.0 ([78af1b2](https://github.com/madisonbikes/bikeweek-backend/commit/78af1b2ab7da58912383562a40d20f1861196eac))
- bump mongodb from 5.2.0 to 5.3.0 ([6b4ac56](https://github.com/madisonbikes/bikeweek-backend/commit/6b4ac56292d0e18604d0fe35cb4afd6472be5c1a))
- bump mongodb from 5.3.0 to 5.6.0 ([135260c](https://github.com/madisonbikes/bikeweek-backend/commit/135260c51e0fc7a3a6679e5f983922a711a1608e))
- bump mongodb from 5.6.0 to 6.3.0 ([36b2448](https://github.com/madisonbikes/bikeweek-backend/commit/36b2448fc9938db7aa4072b921b49b64098700a9))
- bump passport from 0.6.0 to 0.7.0 ([1568ab1](https://github.com/madisonbikes/bikeweek-backend/commit/1568ab13f7a40d814ea21e5453a420a2c8bfeb9b))
- bump pino from 8.11.0 to 8.12.1 ([9f1aa39](https://github.com/madisonbikes/bikeweek-backend/commit/9f1aa39b28395e9604fc1b12687c0589da874152))
- bump pino from 8.12.1 to 8.14.1 ([3ec8fed](https://github.com/madisonbikes/bikeweek-backend/commit/3ec8fed6f998f3ba8014de1e90044a20c7a61456))
- bump pino from 8.14.1 to 8.18.0 ([e4ab685](https://github.com/madisonbikes/bikeweek-backend/commit/e4ab685e1b6a977ce587c69a2f3c901a36dd3495))
- bump pino from 8.18.0 to 8.19.0 ([1f11395](https://github.com/madisonbikes/bikeweek-backend/commit/1f11395d022e4149fef57c54c38731fce4b5a604))
- bump pino from 8.9.0 to 8.11.0 ([58c70d1](https://github.com/madisonbikes/bikeweek-backend/commit/58c70d140e49a1ccd066e1f7196c7e23f5de5f02))
- bump pino-pretty from 10.0.0 to 10.3.1 ([d8f359c](https://github.com/madisonbikes/bikeweek-backend/commit/d8f359cf94d24472ff74e914aae6f7033cbbeeeb))
- bump pino-pretty from 9.1.1 to 9.3.0 ([37d4fc5](https://github.com/madisonbikes/bikeweek-backend/commit/37d4fc5e442e78233261fa1fb7320d7287338fb3))
- bump pino-pretty from 9.3.0 to 9.4.0 ([f63f2d5](https://github.com/madisonbikes/bikeweek-backend/commit/f63f2d512e66b6fbd8813009cbb583ffc44b9ab0))
- bump pino-pretty from 9.4.0 to 10.0.0 ([172a1e7](https://github.com/madisonbikes/bikeweek-backend/commit/172a1e753e04aa274ae48a8adf96d88cff3bd6e3))
- bump pm2 from 5.2.0 to 5.2.2 ([1e1a18b](https://github.com/madisonbikes/bikeweek-backend/commit/1e1a18bedf72bd29417b1b8896383ea636b59d90))
- bump redis from 4.6.12 to 4.6.13 ([2ad062e](https://github.com/madisonbikes/bikeweek-backend/commit/2ad062e4a722e97373111cbbac1807f603c9cd83))
- bump redis from 4.6.4 to 4.6.5 ([a68a437](https://github.com/madisonbikes/bikeweek-backend/commit/a68a437ebd563352c8ca60f06a826434ddb8d0b8))
- bump redis from 4.6.5 to 4.6.6 ([01b4c90](https://github.com/madisonbikes/bikeweek-backend/commit/01b4c901af824cd738accfc5d03dfc4b565ffce5))
- bump redis from 4.6.6 to 4.6.12 ([e09ec54](https://github.com/madisonbikes/bikeweek-backend/commit/e09ec547487c89eda7f2edb40ccc84eb920845f6))
- bump reflect-metadata from 0.1.13 to 0.2.1 ([d1ee08a](https://github.com/madisonbikes/bikeweek-backend/commit/d1ee08a8c5283bb318d6065233de1579fb838fc1))
- bump set-interval-async from 2.0.3 to 3.0.2 ([c89ffa2](https://github.com/madisonbikes/bikeweek-backend/commit/c89ffa21233c765af66bfb226fc4e312a4a7d3b2))
- bump superagent and @types/superagent ([889798e](https://github.com/madisonbikes/bikeweek-backend/commit/889798e2553b5c38530bd761cec9334411bcfa1d))
- bump superagent from 8.0.0 to 8.0.1 ([7187d83](https://github.com/madisonbikes/bikeweek-backend/commit/7187d83a0f36d0b087efd5565d31ffb680a94cab))
- bump to typescript 5.0.2 ([d4b623f](https://github.com/madisonbikes/bikeweek-backend/commit/d4b623f81fdc3d79514d645ef12352153e3fa295))
- bump ts-jest to 29.1.0 and TS5 support ([360401f](https://github.com/madisonbikes/bikeweek-backend/commit/360401fd5de9c435b1db9e805bf92e2fe8577bb5))
- bump ts-node from 10.8.1 to 10.8.2 ([3acb59d](https://github.com/madisonbikes/bikeweek-backend/commit/3acb59dab3b9a63ef4dd4a3a2f25cc2e5798872b))
- bump ts-node from 10.8.2 to 10.9.1 ([6ed8aa1](https://github.com/madisonbikes/bikeweek-backend/commit/6ed8aa1da7274cd57c77070cda1aba446e1062f6))
- bump ts-node from 10.9.1 to 10.9.2 ([c165a20](https://github.com/madisonbikes/bikeweek-backend/commit/c165a2058779b290d76ee7dda25abc17c60b9988))
- bump tsyringe from 4.7.0 to 4.8.0 ([6015267](https://github.com/madisonbikes/bikeweek-backend/commit/60152679bceced8fe05ce374aa1a5b5cc817d895))
- bump typescript from 4.7.4 to 4.8.2 ([7dedbce](https://github.com/madisonbikes/bikeweek-backend/commit/7dedbce67596db51b7115d22df674bdfe3829454))
- bump typescript from 4.8.2 to 4.8.4 ([4cf9032](https://github.com/madisonbikes/bikeweek-backend/commit/4cf90328e67b48784fea86191ab3f739dfa16cbd))
- bump yargs and @types/yargs ([b64cdbd](https://github.com/madisonbikes/bikeweek-backend/commit/b64cdbd56916fd2c65335f9da760bbbb38ae1ffa))
- bump yargs from 17.6.2 to 17.7.0 ([429ba8f](https://github.com/madisonbikes/bikeweek-backend/commit/429ba8f787f8af90f24ac0bb7bcd7d0e28d388af))
- bump yup from 1.0.0-beta.4 to 1.0.0-beta.7 ([0bc8d54](https://github.com/madisonbikes/bikeweek-backend/commit/0bc8d541ad6a75b9e243950b31380b1a74a264df))
- bump zod from 3.20.2 to 3.20.6 ([19f4af1](https://github.com/madisonbikes/bikeweek-backend/commit/19f4af16003bb4fdb32cb2792278396f93142fee))
- bump zod from 3.20.6 to 3.21.4 ([4c32e42](https://github.com/madisonbikes/bikeweek-backend/commit/4c32e4269bb18d9e0d3e5a2c96c2ab209b20394c))
- bump zod from 3.21.4 to 3.22.4 ([331088b](https://github.com/madisonbikes/bikeweek-backend/commit/331088bd6e59c25725208138ac122ef4c0282f67))
- connect-redis v7 needs legacy mode disabled ([3cf8901](https://github.com/madisonbikes/bikeweek-backend/commit/3cf8901d5ecdcc3c0705facfdffd6cb3116d1f5f))
- db sync status lookup would fail with no data found ([a735f90](https://github.com/madisonbikes/bikeweek-backend/commit/a735f900a83f21cbd9e2e2f0517abe0924b82614))
- enable secure cookies for deployment ([ffbbe82](https://github.com/madisonbikes/bikeweek-backend/commit/ffbbe8299d6bc8b3497113f768bfcf0d39ab92a6))
- enable typesafety using zod for db reads and remote gravity forms reads ([58c29d8](https://github.com/madisonbikes/bikeweek-backend/commit/58c29d8b926789436db28d1dbb23477c02666adc))
- end of week party shouldn't exclude events from being sync'd if there are other types ([36fc0f1](https://github.com/madisonbikes/bikeweek-backend/commit/36fc0f1919e16ff00643442d199b88044336e7fd))
- eslint should ignore coverage ([e62281a](https://github.com/madisonbikes/bikeweek-backend/commit/e62281a21e6e6282b3246c953304c0571e5f9af9))
- expose reverse proxy trust session config option ([96177fe](https://github.com/madisonbikes/bikeweek-backend/commit/96177fe2ab288d49ccd8e97682a6f3139eee4499))
- include event url test was inverted ([25e67f3](https://github.com/madisonbikes/bikeweek-backend/commit/25e67f3af813207ef4a5961642de65f3cf91c2ab))
- increase open pull request limit ([4fef810](https://github.com/madisonbikes/bikeweek-backend/commit/4fef8101e15df6a576de1d2958c920afef655466))
- insertMany fails if supplied zero-length array ([cb88e2a](https://github.com/madisonbikes/bikeweek-backend/commit/cb88e2a3a9877eef61252e0d84f721f67f62fa8a))
- lint fixes ([07c0862](https://github.com/madisonbikes/bikeweek-backend/commit/07c086284b9cb8b5ec4c73edfc803bab8e71095f))
- migrate from yup to zod for validations ([47dda25](https://github.com/madisonbikes/bikeweek-backend/commit/47dda2553f814caca992776602c68dc9b4b4ec5e))
- no longer use yup ([93b64e0](https://github.com/madisonbikes/bikeweek-backend/commit/93b64e035f2007bb8e0a688abf6bf32a8569dd10))
- node 18 ts fixes ([268acf6](https://github.com/madisonbikes/bikeweek-backend/commit/268acf603d99b3c2295b28f333d75d5e258c4ecd))
- pm2 not needed as dependency when launched w/npx ([b1d7588](https://github.com/madisonbikes/bikeweek-backend/commit/b1d75888bb34e361d56c791777393b850491be1f))
- pm2 update, use npx to run pm2 to ensure latest version ([3357e01](https://github.com/madisonbikes/bikeweek-backend/commit/3357e019c247b4de0502b438fe369397df5fae67))
- remove unnecessary "strict" in tsconfig ([7ca70b3](https://github.com/madisonbikes/bikeweek-backend/commit/7ca70b37f466e01a1374b5ca51d3fd239c92021c))
- remove unused dependencies ([66700d9](https://github.com/madisonbikes/bikeweek-backend/commit/66700d928f0f35b0f580a95bb67268e8be88c01d))
- run tests on node 18 ([63ca12c](https://github.com/madisonbikes/bikeweek-backend/commit/63ca12c41a0ef68af0e4b7017487d5d8bee71e98))
- sched sync was formatting dates wrong ([55de239](https://github.com/madisonbikes/bikeweek-backend/commit/55de239970eca73eb55c7c97b166022ca7c4a5e0))
- some database issues causing trouble with client ([acd3eab](https://github.com/madisonbikes/bikeweek-backend/commit/acd3eab8ad0862e4bca9189900f63bc9ea0f9a13))
- update mongodb to 6.5.0, fix types on user, event and status collections ([bae1119](https://github.com/madisonbikes/bikeweek-backend/commit/bae1119cece66a718cb6e184efdfe1e102f88a40))
- updated locations from city list and form choices ([56e9265](https://github.com/madisonbikes/bikeweek-backend/commit/56e926547e9ac7935d491e5465a39298b5493b44))
- use status code definitions instead of hardcoded numbers ([8a6bd37](https://github.com/madisonbikes/bikeweek-backend/commit/8a6bd371a6d311f503bb2bff008154b84299370a))
- validate return for session/info ([daa512d](https://github.com/madisonbikes/bikeweek-backend/commit/daa512d4551615aad3549e59e677c7f3bab9934d))
