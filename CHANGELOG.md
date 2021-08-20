# [2.0.0](https://github.com/trunkclub/lumberjack/compare/v1.0.0...v2.0.0) (2021-08-20)


### Bug Fixes

* **audit util:** updates how and where params are added to audit paths ([6e3df30](https://github.com/trunkclub/lumberjack/commit/6e3df30b2f299b28f4040507f5e1039270509706))
* **client:** switch to latest report summary rather than all report summaries ([55fc50d](https://github.com/trunkclub/lumberjack/commit/55fc50d0fa5b81a561145686f9bf33487a70805b))
* **content eval:** adjusts the valid content check to find empty pages ([9a8c793](https://github.com/trunkclub/lumberjack/commit/9a8c7938eddbcbc4907d0cc5c87a24d16298f9c0))
* **divider:** fixes spacing and sizing issues from recent theme adjustments ([a0bd5e1](https://github.com/trunkclub/lumberjack/commit/a0bd5e13da3ad20d8f320b4744fea75dcf26b0fe))
* **gitignore:** removed audit-data folder from gitignore, which kept reports from being commited ([1031f44](https://github.com/trunkclub/lumberjack/commit/1031f44f17836f1d80afce6d10b2a8eab62c8d05))
* **homepage:** fixes math and summary order on homepage ([1b8a6a6](https://github.com/trunkclub/lumberjack/commit/1b8a6a684068ff08e1e6356342916fd028445b9c))
* **initial run:** fixes issue where initial run wasn't populating summaries folder as expected ([23972a2](https://github.com/trunkclub/lumberjack/commit/23972a2d4d8c14db5faa7146009f9843dbfa9baf))
* **nav links:** fixes feature report links ([b769c74](https://github.com/trunkclub/lumberjack/commit/b769c74ad07a859115d40276cd3c892436d62274))
* **reports:** adds back combine command removed by mistake ([d7c058f](https://github.com/trunkclub/lumberjack/commit/d7c058fa39b37bbcecce614c11a77fec0573f8ca))
* **schema:** sets with/without arrays to accept null/empty results; would throw error previously ([7daa46a](https://github.com/trunkclub/lumberjack/commit/7daa46ad3585ee0891acbdfef0b0fd26c4b5420b))
* **sidenav:** fixes issue where feature nav only showed up on homepage ([ef20377](https://github.com/trunkclub/lumberjack/commit/ef203778d4eb83080777eb9f9aa8a731792326aa))
* **summaries:** adds missing key value ([f0e9cd2](https://github.com/trunkclub/lumberjack/commit/f0e9cd2ad51bddf1c3612099886a7b1659d4467e))
* **typing:** fixes wrong key value missed from batch typing changes ([6af3bc9](https://github.com/trunkclub/lumberjack/commit/6af3bc9729ab2c2513e55a4729eaf0158fb99ae9))
* **typo:** fixes typo in no-violations message ([b6eaa7e](https://github.com/trunkclub/lumberjack/commit/b6eaa7e9d330bbc5bb2846c997c65cf78278d9d1))
* **versioning:** fixes yaml formatting ([b06df93](https://github.com/trunkclub/lumberjack/commit/b06df93caab468b7fa605fa4e2c09e066598b03f))
* **versioning:** updates release ci content ([1bb00e9](https://github.com/trunkclub/lumberjack/commit/1bb00e90ae07e5b5f35a4e0c3c94fa6cfbc5f674)), closes [#74](https://github.com/trunkclub/lumberjack/issues/74)
* **violation tally:** fixes issue where tally wasn't being calculated ([7025264](https://github.com/trunkclub/lumberjack/commit/702526439fffebfbec825ac540b0150e76ebf84d))


### Code Refactoring

* **config:** shifts to js for config, updates user population ([70c8c54](https://github.com/trunkclub/lumberjack/commit/70c8c54d565c786467c113dd449a9a51fa459f67)), closes [#64](https://github.com/trunkclub/lumberjack/issues/64)
* **route report:** removes unused route report code ([f4a9d39](https://github.com/trunkclub/lumberjack/commit/f4a9d39d4548ebde1537795408cebf9174708b8f))


### Features

* **about:** adds about page with more information about data and project ([74e8d56](https://github.com/trunkclub/lumberjack/commit/74e8d565cbb483188418a0250b020d2bf75e9e6f))
* **app data:** replaces app id with name and surfaces in client ([df1bb02](https://github.com/trunkclub/lumberjack/commit/df1bb0262cf28fd7ec0cbb4415efd87376a11f15)), closes [#64](https://github.com/trunkclub/lumberjack/issues/64)
* **audit:** adds scroll to bottom before running test ([4649176](https://github.com/trunkclub/lumberjack/commit/4649176602a7ca58a12629b978fed3badfa84d39))
* **barchart:** adds support for 'none' impact level and updates colors ([612c235](https://github.com/trunkclub/lumberjack/commit/612c2354e9c30768af957e64c5337e499809ed2c))
* **client:** adds in client files ([267f1da](https://github.com/trunkclub/lumberjack/commit/267f1dad916fe02efbbea6de2fdc01b27f8589d5))
* **components:** adds data display components ([85ea9ae](https://github.com/trunkclub/lumberjack/commit/85ea9ae8da82d0c5e7e88dfff7185f7114eb85d6))
* **config:** allows a container element to be passed to audit script ([b4140d8](https://github.com/trunkclub/lumberjack/commit/b4140d8838421f34dec18b626d21fe79b40e04e3))
* **feature summary:** redesigns feature summary page ([da76e3e](https://github.com/trunkclub/lumberjack/commit/da76e3ec97ed722f4f1ee9938594e94a724b6762))
* **feature summary:** refactors and redesigns feature summary page ([8c0370f](https://github.com/trunkclub/lumberjack/commit/8c0370fda3faa679f27de7f91d19e63b1df1fc3f))
* **home:** adds new overview chart to homepage ([c273a95](https://github.com/trunkclub/lumberjack/commit/c273a951f219fffe2cc721961eb5f2213056ea15))
* **ifeature-summaries:** sets up report for feature-level summaries ([52b9046](https://github.com/trunkclub/lumberjack/commit/52b9046b8ec9f35bc37f806db3354e8b934b84d8))
* **impact:** adds tags to impact reports. Shows what guidelines (WCAG AA, etc) are violated ([6c8c479](https://github.com/trunkclub/lumberjack/commit/6c8c479ad44c9730269bce26f6abadcf76efbd50))
* **impact pages:** modifies impact pages to be more like feature pages, and cleans up some imports ([bf7fbd8](https://github.com/trunkclub/lumberjack/commit/bf7fbd86add7204c23ba797ad7a87d02bfcdf2d0))
* **impact reports:** overhauls impact report pages ([20b54e0](https://github.com/trunkclub/lumberjack/commit/20b54e04effc0e08ada3572c4ea91d9cf642deb8))
* **impact-report:** adds more context and granularity of data to impact report ([7c10df4](https://github.com/trunkclub/lumberjack/commit/7c10df4155c10e6e8dc8ecc771c937024f7067aa))
* restores snapshot functionality from earlier version of Lumberjack ([8466589](https://github.com/trunkclub/lumberjack/commit/8466589b6f0c2508f9e2501e96927e4d3f0155db))


### BREAKING CHANGES

* **config:** Existing JSON files in config folder will no longer be referenced; must switch to
.ljconfig.js instead.
* **impact reports:** Impact report now presents data in a drastically different way from before.
* **route report:** a type of report is removed
