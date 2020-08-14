# [1.66.0](https://github.com/threeify/threeify/compare/v1.65.0...v1.66.0) (2020-08-14)


### Bug Fixes

* camera aspect ratio in layer renderer. ([83dc18a](https://github.com/threeify/threeify/commit/83dc18a6605360275fa728086234f553393c7c40))
* center composite ([c8d6703](https://github.com/threeify/threeify/commit/c8d67035a78b48615bccb132eccc3bad4e7bd702))
* clamp to edge on layer textures. ([1cb3e51](https://github.com/threeify/threeify/commit/1cb3e519f163d58d2081f8fe62bd2b4304275f72))
* fix local->world space layer transform ([091bfcd](https://github.com/threeify/threeify/commit/091bfcdc425c3b7c071017010badf0a39d3d3ccf))
* fix various bugs from refactoring in examples. ([31de989](https://github.com/threeify/threeify/commit/31de989dfb1f1912397cb3fa253a6a8248a30ed5))
* leaked abstraction of WebGL ([4e69485](https://github.com/threeify/threeify/commit/4e69485a4e17d4554878e7925bf7306b81a37bd5))
* world->view and view->screen transforms for layer renderer ([6a946b2](https://github.com/threeify/threeify/commit/6a946b2b7d52645867590dd102d8bac1120e2855))


### Features

* add shirt sample ([f7082f7](https://github.com/threeify/threeify/commit/f7082f75363fd035e96846104b75c247a8bf8ff0))
* add touch event handling to compositor example ([bcf424b](https://github.com/threeify/threeify/commit/bcf424bb503078f4c5642f13174bc89a239b1a62))
* enable direct image loading in LayerCompositor for max speed ([bd1fc0a](https://github.com/threeify/threeify/commit/bd1fc0a04087ab881a4c5684454d00e411baeefd))
* fetchImageBitmap - ultra fast image loading for TexImage2D ([3267f4c](https://github.com/threeify/threeify/commit/3267f4c1b87f2ed0e08ae6d975ebf32ae795d2cd))
* layer compositor ([5ae20da](https://github.com/threeify/threeify/commit/5ae20da85d5748bd3bf47a9855fd3a1540ae1a18))
* layer engine - zoom ([9a7703d](https://github.com/threeify/threeify/commit/9a7703d9cee94dba5a3bf290a2af59541c6e5c59))
* layer renderer ([1852ea9](https://github.com/threeify/threeify/commit/1852ea973aadbcd67b03b82af4fafe5d48cbf474))

# [1.65.0](https://github.com/threeify/threeify/compare/v1.64.0...v1.65.0) (2020-07-29)


### Features

* directory for glsl samplers ([3d8ae72](https://github.com/threeify/threeify/commit/3d8ae7234ab4777932fbbeecd4e7934f94ab9646))
* framework for lambertian importance sampler ([369485e](https://github.com/threeify/threeify/commit/369485e2c11329e722c8185c814721d133f88cae))
* lambertian importance sampler produces result ([a11ee44](https://github.com/threeify/threeify/commit/a11ee4478351efa3be5bd1c84b5d03246248842c))
* struct unit tests. ([dc635b2](https://github.com/threeify/threeify/commit/dc635b2c87840ec912c9c1fa050c8b75ea475413))

# [1.64.0](https://github.com/threeify/threeify/compare/v1.63.0...v1.64.0) (2020-07-29)


### Bug Fixes

* fix equilateral example after latlong name change ([c4a2aff](https://github.com/threeify/threeify/commit/c4a2affa9881c2ff98138b3ac0e65ec45a0bc461))


### Features

* remove completely Surface glsl struct ([662db5d](https://github.com/threeify/threeify/commit/662db5d1d8e3fc1611376cacf5bac6dc7305ba57))

# [1.63.0](https://github.com/threeify/threeify/compare/v1.62.0...v1.63.0) (2020-07-29)


### Bug Fixes

* anisotropy works without Surface ([b5c3280](https://github.com/threeify/threeify/commit/b5c3280e854bff0c9f6ee8e4f3747be97e8b275e))
* make normals, displacement examples work again. ([8de52cf](https://github.com/threeify/threeify/commit/8de52cf45e5184588ef8e41d96dcede08dcb8cbd))
* sheen works without Surface ([60caa7e](https://github.com/threeify/threeify/commit/60caa7ece0d56b00b38090e664341725551bc03e))


### Features

* add degToRad, radToDeg in glsl with unit tests ([a6237eb](https://github.com/threeify/threeify/commit/a6237eb1c139cc6af47a7dde1a49ed09d0c7ffb9))
* add mat2RotateDirection ([b2761ae](https://github.com/threeify/threeify/commit/b2761ae673806df33831245a5f2208b7b49251c6))
* add mat4 to glsl unit tests. ([1403c01](https://github.com/threeify/threeify/commit/1403c0189322267a87425a564c5fb08154f7a729))
* add spherical.glsl and adopt it in latLong conversion code. ([cd76e43](https://github.com/threeify/threeify/commit/cd76e433e1cd6ad4f98baebff410f4846ff907f4))
* adopt threshold for mat3/mat2 compares. ([80517a6](https://github.com/threeify/threeify/commit/80517a6d3e95c6e7aee516a862a6a9f65adc5560))
* isolate glsl unit tests that fail and report on them. ([ff0e595](https://github.com/threeify/threeify/commit/ff0e5956b1da73396d50cc6e5587cd05908b4a16))
* mat2 glsl helpers with tests. ([978dde2](https://github.com/threeify/threeify/commit/978dde2c8faeca1c5e7d55e5d5cfb80574c0cc5b))
* mat3 glsl helpers with tests ([d1d222b](https://github.com/threeify/threeify/commit/d1d222b1447bacf5fd1a01f282e9a844a80b7bc7))
* matrix4 -> mat4.glsl and unify matrix func naming scheme. ([e5e9bb6](https://github.com/threeify/threeify/commit/e5e9bb602fdd5d8be1ba0f6f36b4aa34d151846a))
* rename spherical to nzSpherical to reflect its polarity. ([28e3949](https://github.com/threeify/threeify/commit/28e3949746a334adb6ba317504f7ed4cf5816840))
* replace Surface struct with proper tangentToView mat3 ([da01669](https://github.com/threeify/threeify/commit/da01669737e8201bd74d577f48d4ceb12624d80e))
* validated mat3 rotation on axes ([4d023bc](https://github.com/threeify/threeify/commit/4d023bc9be6be9def7ab5aaa580e6fa6e6dc7cc2))
* yuv <-> linear rgb conversion. ([c864909](https://github.com/threeify/threeify/commit/c864909a5cdb88ef857762e2692a7ae252895365))

# [1.62.0](https://github.com/threeify/threeify/compare/v1.61.1...v1.62.0) (2020-07-28)


### Features

* rename equirectangular to latLong, more user friendly ([9edeb8f](https://github.com/threeify/threeify/commit/9edeb8fee60464648f7de3a85fab87abf1521af8))

## [1.61.1](https://github.com/threeify/threeify/compare/v1.61.0...v1.61.1) (2020-07-28)


### Bug Fixes

* normal maps coordinate fix ([460fc68](https://github.com/threeify/threeify/commit/460fc684b77aed8bbc0c17c762c8bbdad9390c97))

# [1.61.0](https://github.com/threeify/threeify/compare/v1.60.0...v1.61.0) (2020-07-28)


### Features

* refactor towards standard BRDF form (incoming irradiance to output radiance) ([2dc16f7](https://github.com/threeify/threeify/commit/2dc16f73f4f44bce569512809da98f8250199196))
* simplify DirectLight to radiance and direction. Use dotNL instead of normalFluxRatio. ([e623d6a](https://github.com/threeify/threeify/commit/e623d6a34541aa8cea908114cec0e100a6b075ba))

# [1.60.0](https://github.com/threeify/threeify/compare/v1.59.0...v1.60.0) (2020-07-24)


### Bug Fixes

* fix y-flip bug in cubeFaceUVToDirection ([d0f0d17](https://github.com/threeify/threeify/commit/d0f0d176744e41afdd6e9817020b9be30b579d63))


### Features

* add tracking of GPU resources ([f8c7195](https://github.com/threeify/threeify/commit/f8c7195b8ecc55f704bc295e1cdf0864a4d6aa8d))
* cubeFaceUVToDirection is unit tested and corrected. ([3808b1a](https://github.com/threeify/threeify/commit/3808b1a87fb7c68f97661ff79c481649b4b17c6c))
* more comprehensive cube face uv glsl tests ([aeafe52](https://github.com/threeify/threeify/commit/aeafe5231a7629b36ed2a6dafaada4ec5aa5c36b))

# [1.59.0](https://github.com/threeify/threeify/compare/v1.58.0...v1.59.0) (2020-07-23)


### Bug Fixes

* fix broken TexImage2D class ([98d9a88](https://github.com/threeify/threeify/commit/98d9a884ef1dbc249a60c92b3a4c8fbec1f76de5))


### Features

* refactor away large cubeMapFaces, replace with atomic arrays ([a7362bb](https://github.com/threeify/threeify/commit/a7362bb9c9a47ce0bd7d587e33fe8329c4460fad))

# [1.58.0](https://github.com/threeify/threeify/compare/v1.57.0...v1.58.0) (2020-07-23)


### Features

* makeCubeMapFromEquirectangularTexture utility function ([cf6a476](https://github.com/threeify/threeify/commit/cf6a476686bd4910a687506ea758a08ef58b176e))

# [1.57.0](https://github.com/threeify/threeify/compare/v1.56.0...v1.57.0) (2020-07-23)


### Features

* add equirectangular to cubemap example ([f129c50](https://github.com/threeify/threeify/commit/f129c502c9602c3a50c9c5904562266887286a55))

# [1.56.0](https://github.com/threeify/threeify/compare/v1.55.0...v1.56.0) (2020-07-23)


### Features

* refactored output channels example ([e84be98](https://github.com/threeify/threeify/commit/e84be98f6a3139ad734373e9210fe71b4f39ed6b))

# [1.55.0](https://github.com/threeify/threeify/compare/v1.54.0...v1.55.0) (2020-07-22)


### Features

* material output example ([c12ee6d](https://github.com/threeify/threeify/commit/c12ee6d44d440cd1e069774c331f02743986ef37))

# [1.54.0](https://github.com/threeify/threeify/compare/v1.53.0...v1.54.0) (2020-07-22)


### Features

* unitInterval to vec3. fix vec2 to unitInterval.  clean up unit tests in general. ([0c1d679](https://github.com/threeify/threeify/commit/0c1d6792d26d57fef7cf05bb848224686b43eae3))

# [1.53.0](https://github.com/threeify/threeify/compare/v1.52.0...v1.53.0) (2020-07-22)


### Bug Fixes

* asset -> asssert spelling error. ([466f3b4](https://github.com/threeify/threeify/commit/466f3b44f391da514b172ca3d70ed6aa68a7c610))


### Features

* add Vector4 tests. ([1ed06e0](https://github.com/threeify/threeify/commit/1ed06e03772ac5f25e08d31bf8f9e566b1d4bb55))

# [1.52.0](https://github.com/threeify/threeify/compare/v1.51.0...v1.52.0) (2020-07-22)


### Bug Fixes

* Euler.set ([09d90ee](https://github.com/threeify/threeify/commit/09d90eea6801d1875ee6a629638413708105996a))
* Quaternion.copy ([578efe5](https://github.com/threeify/threeify/commit/578efe5ca78ae711eee08906e742f9e4e6d447a5))


### Features

* expanded unit test coverage for Euler, Quaternion, Vector2 and Vector3. ([820a635](https://github.com/threeify/threeify/commit/820a6353ec30008699f21680a3ef8adabed6b572))
* simplified DeviceOrientation ([929156e](https://github.com/threeify/threeify/commit/929156e514bdf3e3b527dae410ae309c54554ea3))
* standalone and simplier device orientation example ([d492098](https://github.com/threeify/threeify/commit/d492098f7622084ff9a415391500b998aceeb946))

# [1.51.0](https://github.com/threeify/threeify/compare/v1.50.0...v1.51.0) (2020-07-21)


### Features

* add DeviceOrientationController ([1649801](https://github.com/threeify/threeify/commit/1649801861a5c2f5d91037ed27a6ba5c98c7fb00))
* add radToDeg, degToRad ([ac4a646](https://github.com/threeify/threeify/commit/ac4a646f30ae4eb77c053ed777eccb0bffffda4a))
* add transform(Point|Direction) for Vector2 ([47b8dcd](https://github.com/threeify/threeify/commit/47b8dcd232d88939d67ecf56f5879ecc6b4f9d34))
* upgrade es-dev-server to https ([7be5842](https://github.com/threeify/threeify/commit/7be5842f68f77eb4d4a1495458f9d7db4fdf7bfc))

# [1.50.0](https://github.com/threeify/threeify/compare/v1.49.0...v1.50.0) (2020-07-20)


### Bug Fixes

* flip video texture coordinates. ([c8cac97](https://github.com/threeify/threeify/commit/c8cac973bf54321da68d3bc9ff4579de89b98e94))
* PrimitiveView was using inconsistent byte and float strides. ([182d36b](https://github.com/threeify/threeify/commit/182d36b0aa17232cbb4ed7b93241853ad24c6485))
* uninitialized uniform when hashcode is 0 error. ([4dc5399](https://github.com/threeify/threeify/commit/4dc53991747fa07d409f4b69dd9a9c3cc65e7299))


### Features

* add async cube map loaders ([fdf4773](https://github.com/threeify/threeify/commit/fdf4773226a6d13017ba3bc62d04afd23ae4d14b))
* add glTF sample environments ([53ddd9d](https://github.com/threeify/threeify/commit/53ddd9db46349704598f313bd3845167207232ef))
* add greggman's webgl-error-check script. ([b8ddf41](https://github.com/threeify/threeify/commit/b8ddf411c36d4c9ee7acf197e9d8d325dff8838b))

# [1.49.0](https://github.com/threeify/threeify/compare/v1.48.0...v1.49.0) (2020-07-20)


### Features

* lambert brdf glsl unit tests ([45f4bc3](https://github.com/threeify/threeify/commit/45f4bc3353ca6cfbf1990cebc899fda952879aba))

# [1.48.0](https://github.com/threeify/threeify/compare/v1.47.0...v1.48.0) (2020-07-20)


### Features

* perfect equirectangular uv <-> direction equivalency ([247755a](https://github.com/threeify/threeify/commit/247755ad03ab326e525e912779e0ec96d14e7fff))

# [1.47.0](https://github.com/threeify/threeify/compare/v1.46.0...v1.47.0) (2020-07-19)


### Bug Fixes

* direction to equirectangular uv was not calibrated for right hand coordinate systems ([6db2f27](https://github.com/threeify/threeify/commit/6db2f274437a368714c21c8727bf03b091cc7546))
* plane UVs are not correct in texture space ([7b2ff75](https://github.com/threeify/threeify/commit/7b2ff751221d9391380a1ac4b7a928d912667f88))
* uvs for pass Geometry were not in texture space ([7d82a46](https://github.com/threeify/threeify/commit/7d82a46a05b975330d6fdc4b27f8b61c25313b98))
* uvs in passGeometry were not in texture space properly ([dde849a](https://github.com/threeify/threeify/commit/dde849af95aee3a8ba191529af64a8df9338be0d))


### Features

* add coordinate space references. ([56069cc](https://github.com/threeify/threeify/commit/56069cc9474275981e55d5aaccbc1618a20e8ec9))
* add texture space to coordinate references. ([6a57989](https://github.com/threeify/threeify/commit/6a579896d45c11be550ee867ad101c4d1feae20e))

# [1.46.0](https://github.com/threeify/threeify/compare/v1.45.1...v1.46.0) (2020-07-19)


### Bug Fixes

* fix isna ([765e703](https://github.com/threeify/threeify/commit/765e703779f0f3718a306efe806e81d2a46328c5))
* fix seam by not allowing for mipmap filtering on equirectangular cube map ([fef13d2](https://github.com/threeify/threeify/commit/fef13d28d7fe2c3a2c293ea3ad9df954feeab677))
* isnan and isinf glsl unit tests pass now ([a18631c](https://github.com/threeify/threeify/commit/a18631cd396a391325ea10d96d17866245a202ba))


### Features

* add isinf and fix isnan ([7597071](https://github.com/threeify/threeify/commit/75970716ab5c87d5324a933324e8d7b92dbefbee))

## [1.45.1](https://github.com/threeify/threeify/compare/v1.45.0...v1.45.1) (2020-07-19)


### Bug Fixes

* math glsl tests except for isnan ([a53a59e](https://github.com/threeify/threeify/commit/a53a59e9a7a85cc2991905e6c3936babeb5b5bf1))

# [1.45.0](https://github.com/threeify/threeify/compare/v1.44.0...v1.45.0) (2020-07-19)


### Bug Fixes

* rgbe unit tests pass. ([c2a4d9c](https://github.com/threeify/threeify/commit/c2a4d9ce9b7c63c7925ea4a958fcc300bb175df1))


### Features

* rgbd color encoding. ([3ee1544](https://github.com/threeify/threeify/commit/3ee15445de92bb77f765ab43a312c6a0c14025e7))
* rgbd unit tests ([67b3dda](https://github.com/threeify/threeify/commit/67b3dda5c344dbf8985e752908ebb129f8e292a2))

# [1.44.0](https://github.com/threeify/threeify/compare/v1.43.0...v1.44.0) (2020-07-18)


### Features

* glsl unit test coverage for rgbe, srgb, math and packing. ([f9f5b4f](https://github.com/threeify/threeify/commit/f9f5b4fb8a771c1bec8255294d1c2f6a7b215c84))
* output html text of unit test results with exact test numbers that fail. ([a2530d2](https://github.com/threeify/threeify/commit/a2530d225bd9f0802292387b36b6913a167659ab))

# [1.43.0](https://github.com/threeify/threeify/compare/v1.42.0...v1.43.0) (2020-07-18)


### Bug Fixes

* fix off by one line numbers if shader source code output ([6deb7bc](https://github.com/threeify/threeify/commit/6deb7bc489f1f2dedd694f9a946c1319162e4701))


### Features

* add flush and finish to framebuffer ([7802704](https://github.com/threeify/threeify/commit/780270428cf26af2fea127f92708a8fa4ecdc03f))
* add initial glsl unit test framework ([0a48335](https://github.com/threeify/threeify/commit/0a4833518b1eed6621fafdb91826c4be5d520574))
* add optional webgl helpers from greggman - show draw calls & gl error check ([f0ce29d](https://github.com/threeify/threeify/commit/f0ce29d57b23acf7378d08312d33e5873cd00c3d))
* allow for readPixels from framebuffer ([554f928](https://github.com/threeify/threeify/commit/554f928a255a737f78b4a4827960d96439d8eb4f))
* optional webgl-gl-error-check script in example.html ([9f19a88](https://github.com/threeify/threeify/commit/9f19a88c4928a0e2bcc906ee0f51a8df9d9240dc))

# [1.42.0](https://github.com/threeify/threeify/compare/v1.41.0...v1.42.0) (2020-07-18)


### Features

* simplified pass geometry for post effect passes and similar. ([a8993b6](https://github.com/threeify/threeify/commit/a8993b6636e97fe2b220feb494aaa8f35bcc4849))

# [1.41.0](https://github.com/threeify/threeify/compare/v1.40.0...v1.41.0) (2020-07-18)


### Features

* add cubemap faces table to simplify mappings ([43e35db](https://github.com/threeify/threeify/commit/43e35db6b9c3000a83cbee106b38b3e333c7e926))
* add direction <-> equirectangular conversion functions ([07a43a1](https://github.com/threeify/threeify/commit/07a43a14cbe177009b5ffa0e23a5c5e640c1245a))
* add equirectangular and cross cubemap assets ([318a0e9](https://github.com/threeify/threeify/commit/318a0e9412209475165af56da3e68f55579f073d))
* equirectangular background pass example ([69c216b](https://github.com/threeify/threeify/commit/69c216b5718f3a29527b0e2bfcbfb388cc555d19))
* examples now explicitly list their required extensions. ([2614dda](https://github.com/threeify/threeify/commit/2614dda3dbbedba2c3fcbb611f6fc7e44f146fc6))

# [1.40.0](https://github.com/threeify/threeify/compare/v1.39.1...v1.40.0) (2020-07-16)


### Features

* adopt promise.all in examples for faster image loading. ([0e7bb2d](https://github.com/threeify/threeify/commit/0e7bb2d581d0b1ae8c59ae88c4761b7711993755))
* manual cubemap mipmap loading example ([3e11038](https://github.com/threeify/threeify/commit/3e11038a8a51bb1cdd651a2523da4cb0b61bb88c))
* support manual miomap loading in cubetexture ([212d8d5](https://github.com/threeify/threeify/commit/212d8d5f62ac853a4d831c2c8a47cb03df1dc89d))

## [1.39.1](https://github.com/threeify/threeify/compare/v1.39.0...v1.39.1) (2020-07-16)


### Bug Fixes

* do not use mipmaps if rendering into the first level of a cube map directly ([f5bdc86](https://github.com/threeify/threeify/commit/f5bdc86d98ed1111ccf1c3e4c60c0657c588ce20))

# [1.39.0](https://github.com/threeify/threeify/compare/v1.38.0...v1.39.0) (2020-07-16)


### Bug Fixes

* make lod example work again -- bad minFilter default. ([51d0d76](https://github.com/threeify/threeify/commit/51d0d763ea34ce048e7d2b3767de23502e9ed5ae))


### Features

* cubemap transform/projection helpers ([25eac5b](https://github.com/threeify/threeify/commit/25eac5ba3dab1f9e0292fc4566680ef513c0c153))
* matrix4LookAt ([eaeeb5f](https://github.com/threeify/threeify/commit/eaeeb5fe34cc0bc4b572ae7312e1dc1b1a070124))
* support mip level loading in Texture, CubeTexture, TexImage2D ([b37ac9d](https://github.com/threeify/threeify/commit/b37ac9df571ffa9613dc4d2a1a1feabe93c473b2))

# [1.38.0](https://github.com/threeify/threeify/compare/v1.37.0...v1.38.0) (2020-07-16)


### Features

* render to cube map faces ([26c23f4](https://github.com/threeify/threeify/commit/26c23f4cac627eab176581acdde16fd8c4caebf4))

# [1.37.0](https://github.com/threeify/threeify/compare/v1.36.0...v1.37.0) (2020-07-15)


### Features

* add basic TSDocs generation ([ea41218](https://github.com/threeify/threeify/commit/ea4121896e690b8468439b8ea8a2c61855610d02))
* adopt TSDoc comments on Lights. ([531fe27](https://github.com/threeify/threeify/commit/531fe272a47cfd130876ae9059f5147fd5867204))

# [1.36.0](https://github.com/threeify/threeify/compare/v1.35.1...v1.36.0) (2020-07-14)


### Features

* be consistent in naming roughness and alphaRoughness. ([3cb790a](https://github.com/threeify/threeify/commit/3cb790a171beed43b9fb9a9a114bfc4657aa0934))

## [1.35.1](https://github.com/threeify/threeify/compare/v1.35.0...v1.35.1) (2020-07-13)


### Bug Fixes

* wait for user interaction before playing video ([8e887d3](https://github.com/threeify/threeify/commit/8e887d3b74ecbcf2ee9e4c462a73825293c4bf9e))

# [1.35.0](https://github.com/threeify/threeify/compare/v1.34.0...v1.35.0) (2020-07-13)


### Features

* video to texture example ([12d8029](https://github.com/threeify/threeify/commit/12d8029887c5f197df04e57155d9f5ccf76c26d2))

# [1.34.0](https://github.com/threeify/threeify/compare/v1.33.0...v1.34.0) (2020-07-13)


### Features

* canvas texture example ([b01648b](https://github.com/threeify/threeify/commit/b01648b35c0133aba8a5f813b08bf81b08933b30))

# [1.33.0](https://github.com/threeify/threeify/compare/v1.32.0...v1.33.0) (2020-07-12)


### Features

* add goals to overview in README.md (inspired by PlayCanvas) ([df76405](https://github.com/threeify/threeify/commit/df76405b9abc415e3e177c16567c10cfdb7fe628))
* simplified canvas resizing based on Babylon & PlayCanvas ([9145977](https://github.com/threeify/threeify/commit/9145977901c77d04d8bc5960dfdd267396c85488))

# [1.32.0](https://github.com/threeify/threeify/compare/v1.31.0...v1.32.0) (2020-07-12)


### Bug Fixes

* break should have been at the start of the loop. ([e88fb87](https://github.com/threeify/threeify/commit/e88fb876063fc9bfc1f5c022673d6ad276b56db9))
* directional light description was incorrect ([40e1923](https://github.com/threeify/threeify/commit/40e19232fd763e984e92ccecbdbb3a6d099196d5))


### Features

* add npm/yarn install directions to readme. ([9a8c701](https://github.com/threeify/threeify/commit/9a8c701884344f300668c98c3f6868b0401f41bb))
* add threeify.org to workspace ([e043edc](https://github.com/threeify/threeify/commit/e043edc714a8bae207494089156eaf8a02d47316))
* remove example builder to threeify,org project, ([32ae498](https://github.com/threeify/threeify/commit/32ae498bf05f6d43a8029442d531f700d0136851))

# [1.31.0](https://github.com/threeify/threeify/compare/v1.30.0...v1.31.0) (2020-07-09)


### Bug Fixes

* fix example.json for multi-light example ([2359448](https://github.com/threeify/threeify/commit/23594482c95ed1cc54b1fe55c6485d3f1de4037b))
* improve example build script. ([c20530f](https://github.com/threeify/threeify/commit/c20530f111fe480af336c78fa72f86f126db57b4))


### Features

* break on max light number ([529ed0d](https://github.com/threeify/threeify/commit/529ed0d54e6d8da90550d49945967613f3e52249))

# [1.30.0](https://github.com/threeify/threeify/compare/v1.29.0...v1.30.0) (2020-07-09)


### Features

* multiple punctual light example ([c719305](https://github.com/threeify/threeify/commit/c719305991a44d3b5fe837c5767b26f9708a4f88))

# [1.29.0](https://github.com/threeify/threeify/compare/v1.28.0...v1.29.0) (2020-07-09)


### Features

* add support for array uniforms (float, vec2, vec3, mat4) ([c27d7da](https://github.com/threeify/threeify/commit/c27d7da4d6fdea3e49d157ba28a753e50d205adb))

# [1.28.0](https://github.com/threeify/threeify/compare/v1.27.0...v1.28.0) (2020-07-09)


### Features

* directional light w/ example ([7ff04db](https://github.com/threeify/threeify/commit/7ff04db576e265e775e584b706779ba1f4c0d88c))
* more compelling directional light example - moon texture ([e27f97d](https://github.com/threeify/threeify/commit/e27f97d43a11f87fa125155af40ce7d406d936b3))

# [1.27.0](https://github.com/threeify/threeify/compare/v1.26.0...v1.27.0) (2020-07-09)


### Features

* point light example ([8eb19ad](https://github.com/threeify/threeify/commit/8eb19adc73b38c8dc6e76bd9acdbf9ad71625064))
* spot light example ([88f60b6](https://github.com/threeify/threeify/commit/88f60b6f8cf9112df513c6c48c017ccf9d091f1a))

# [1.26.0](https://github.com/threeify/threeify/compare/v1.25.0...v1.26.0) (2020-07-08)


### Features

* automatic resizing of the canvas framebuffer on element resize ([e276ac0](https://github.com/threeify/threeify/commit/e276ac04ba99c0ebadb2548ae077744a1fa9f1f1))

# [1.25.0](https://github.com/threeify/threeify/compare/v1.24.0...v1.25.0) (2020-07-07)


### Features

* add puppeteer screenshot generation when building examples. ([932726b](https://github.com/threeify/threeify/commit/932726b78776d71339665a603db2e82bed66afc6))

# [1.24.0](https://github.com/threeify/threeify/compare/v1.23.0...v1.24.0) (2020-07-06)


### Features

* unified example viewer. ([9f121bf](https://github.com/threeify/threeify/commit/9f121bfd7db4f5781b841f06c5396da59ab12f3a))

# [1.23.0](https://github.com/threeify/threeify/compare/v1.22.0...v1.23.0) (2020-07-06)


### Features

* add descriptions to example.json files and complete coverage. ([f99e8fe](https://github.com/threeify/threeify/commit/f99e8fe02565bc159ce4daac2457805138ba8693))
* auto-attach render context when one finds a  canvas element with id "threeify-framebuffer" ([a835ddf](https://github.com/threeify/threeify/commit/a835ddfce19470c50a9bee69b9d740e92e53be93))
* json descriptions of examples with multi-lingual support ([4dc51e6](https://github.com/threeify/threeify/commit/4dc51e6c801805747e88961b60ee7d2c04826f2a))

# [1.22.0](https://github.com/threeify/threeify/compare/v1.21.0...v1.22.0) (2020-07-05)


### Features

* improve error message when uniform mismatch ([5429f1f](https://github.com/threeify/threeify/commit/5429f1f61c3b1a410b22ba489673099ec17f46af))

# [1.21.0](https://github.com/threeify/threeify/compare/v1.20.0...v1.21.0) (2020-07-05)


### Bug Fixes

* anisotropy and normal maps are now no longer rotated 90 degrees. ([1e49f5f](https://github.com/threeify/threeify/commit/1e49f5f35fb40d92e54a0fd30a4162fa2dc14709))
* fix incorrect rotation of tangent frame ([838130e](https://github.com/threeify/threeify/commit/838130e43a6c497c7b701b9c6f1166469810fdf2))


### Features

* add opengl normal map plane - ensure correctly with easy case. ([511acaa](https://github.com/threeify/threeify/commit/511acaa905936bb4b8e694158ae74ee63aa100c0))

# [1.20.0](https://github.com/threeify/threeify/compare/v1.19.0...v1.20.0) (2020-07-04)


### Bug Fixes

* fix bug with transform normal ([400e63b](https://github.com/threeify/threeify/commit/400e63b7dbe009471df19908840a43d8047be38a))
* fix uv importing from obj ([3e9c63a](https://github.com/threeify/threeify/commit/3e9c63a3bfef18a1f9edcd0c26e37e3d3662ce0f))


### Features

* add cull state ([6eea327](https://github.com/threeify/threeify/commit/6eea327627a38988f2d1164935f22c54d8943aea))
* add displacement example. ([b93a54f](https://github.com/threeify/threeify/commit/b93a54f4e3408cb0f17470ec18d0e34c2d740ec5))
* add displacement support with example. ([f47f3a2](https://github.com/threeify/threeify/commit/f47f3a25129f21ecbf75dc2f696ac096bc5e36ae))

# [1.19.0](https://github.com/threeify/threeify/compare/v1.18.0...v1.19.0) (2020-07-04)


### Features

* remove dead code from shaders so debugging is easy ([dc527bf](https://github.com/threeify/threeify/commit/dc527bf898042b0f468169019d58af28f8ced206))

# [1.18.0](https://github.com/threeify/threeify/compare/v1.17.0...v1.18.0) (2020-07-04)


### Features

* ultra fast OBJ parser. ([eba0981](https://github.com/threeify/threeify/commit/eba0981f7e001943f3c96934d187806c9197558d))
* upgrade sheen model from CharlieDAshihkminV to CharlieDV ([608b3a4](https://github.com/threeify/threeify/commit/608b3a4f1b5a17d5b5c0066d325db7121bead789))

# [1.17.0](https://github.com/threeify/threeify/compare/v1.16.0...v1.17.0) (2020-07-03)


### Features

* implement sheen brdf for direct lighting ([6fa7822](https://github.com/threeify/threeify/commit/6fa7822fad6f09b640afb4cb7e52786de70381bc))
* simple obj loader. ([7fe03c1](https://github.com/threeify/threeify/commit/7fe03c176389e8085ad3e5c37eea91137680d572))

# [1.16.0](https://github.com/threeify/threeify/compare/v1.15.0...v1.16.0) (2020-07-03)


### Features

* simplify BRDF to exclude incoming irradiance ([c06ea81](https://github.com/threeify/threeify/commit/c06ea81e519db46e1dc523383448feaa069c7c7e))

# [1.15.0](https://github.com/threeify/threeify/compare/v1.14.0...v1.15.0) (2020-07-03)


### Features

* clear coat example (not yet energy conserving) ([61f95b6](https://github.com/threeify/threeify/commit/61f95b6c2283201d80805010f84ea921b0aed8d0))

# [1.14.0](https://github.com/threeify/threeify/compare/v1.13.0...v1.14.0) (2020-07-02)


### Features

* example bundler + minifier + brotli compressor script ([7d56798](https://github.com/threeify/threeify/commit/7d56798ac2c6df7ede2299920f2684630d57c9a7))

# [1.13.0](https://github.com/threeify/threeify/compare/v1.12.0...v1.13.0) (2020-07-02)


### Bug Fixes

* sRGB decoding of albedo textures. ([4ae4e29](https://github.com/threeify/threeify/commit/4ae4e2936486440319b1ae82ad11529f09b2894e))


### Features

* adopt F0 nomiclature for clarify ([b2d1b3c](https://github.com/threeify/threeify/commit/b2d1b3c96242d5083e97b5d8ef81ade18bbb3a4f))

# [1.12.0](https://github.com/threeify/threeify/compare/v1.11.0...v1.12.0) (2020-07-02)


### Bug Fixes

* make bump mapping work properly with screenspace gradients. ([a95da3e](https://github.com/threeify/threeify/commit/a95da3e532c88ed2f68122c80fc09cff0057c1c3))


### Features

* enable natural world space bump map scaling. ([1172b11](https://github.com/threeify/threeify/commit/1172b115e9cc52a41ba4744837cbff0ccaed67b0))

# [1.11.0](https://github.com/threeify/threeify/compare/v1.10.0...v1.11.0) (2020-06-30)


### Features

* add bump map example ([deeebe2](https://github.com/threeify/threeify/commit/deeebe2d7c32333f93805186d804e4f2b19b9ee8))
* add fast bumpToNormal glsl derivation ([9b03dd2](https://github.com/threeify/threeify/commit/9b03dd21ddbe14fe35e2315ba3860da5c04527a8))

# [1.10.0](https://github.com/threeify/threeify/compare/v1.9.0...v1.10.0) (2020-06-30)


### Features

* add ambient BRDF ([49ac01a](https://github.com/threeify/threeify/commit/49ac01a8fad259e462a539d786cc76fceb62d875))
* move shader_lod extension to an optional extension ([3790130](https://github.com/threeify/threeify/commit/3790130622860c2480d93086460e2b56e1497bcf))

# [1.9.0](https://github.com/threeify/threeify/compare/v1.8.0...v1.9.0) (2020-06-30)


### Features

* normal map example. ([b3009b8](https://github.com/threeify/threeify/commit/b3009b8110fd9848952a3c917229221f1ad4c53d))

# [1.8.0](https://github.com/threeify/threeify/compare/v1.7.0...v1.8.0) (2020-06-29)


### Bug Fixes

* correct method for rotating tangent frame. ([8fa1145](https://github.com/threeify/threeify/commit/8fa1145ab0832c3e37bf4cf29dce47df666b362f))


### Features

* antialiasing rendering by default. ([648a78e](https://github.com/threeify/threeify/commit/648a78e7ac0b76f3000f62f79ed976dc791c352d))
* premultiplied alpha by default. ([7493b59](https://github.com/threeify/threeify/commit/7493b598c787e542bd4484a443eb1320d7a96aa3))

# [1.7.0](https://github.com/threeify/threeify/compare/v1.6.0...v1.7.0) (2020-06-29)


### Features

* add cylinder geometry factory ([0cebfde](https://github.com/threeify/threeify/commit/0cebfdefe9b9c899833b81d7bf69a8fbfbbd283b))
* improved anisotropic specular highlight example ([4abdc61](https://github.com/threeify/threeify/commit/4abdc614e338f0efb114b5d438474a443adbb1ab))

# [1.6.0](https://github.com/threeify/threeify/compare/v1.5.0...v1.6.0) (2020-06-29)


### Features

*  primitive factories source files are now lower case. ([737e8aa](https://github.com/threeify/threeify/commit/737e8aa68538d1fcbde1dc56d71ed366112c86b0))
* add disk primitive ([dfef3aa](https://github.com/threeify/threeify/commit/dfef3aad09e711102e4f82bacb73720ce8bed6dd))

# [1.5.0](https://github.com/threeify/threeify/compare/v1.4.0...v1.5.0) (2020-06-29)


### Bug Fixes

* make anisotropic filtering actually work (ordering error) ([8c21b5d](https://github.com/threeify/threeify/commit/8c21b5d7d04a930db8d05ce6c06a2fcd6612d025))


### Features

* anisotropic specular example (via bent normals per filament) ([43366eb](https://github.com/threeify/threeify/commit/43366ebb89557eb9a53bc84a566635e057c7f628))
* derived tangent, bitangent frames ([ac6ca1b](https://github.com/threeify/threeify/commit/ac6ca1b396fe425a43398f2e27742994f4f716c6))

# [1.4.0](https://github.com/threeify/threeify/compare/v1.3.0...v1.4.0) (2020-06-28)


### Features

* Add glsl sturts Surface, PunctualLight, DirectIllumination ([ae48d7e](https://github.com/threeify/threeify/commit/ae48d7e0d9f55e0e155975b16320a57b95e74a69))
* add support for sRGB output,. ([fa9a0c1](https://github.com/threeify/threeify/commit/fa9a0c1929a5cb7d893fea26e565d7f3c92afa2f))
* specular BRDF works. ([51cfeac](https://github.com/threeify/threeify/commit/51cfeac29b9d2e91acf207ceb6a4490df7c5ddaf))

# [1.3.0](https://github.com/threeify/threeify/compare/v1.2.0...v1.3.0) (2020-06-26)


### Features

* lambert example (uvs stretched on polyhedron) ([51d6d0e](https://github.com/threeify/threeify/commit/51d6d0e2766eb70e42e8489e2a1e24d5482faa59))

# [1.2.0](https://github.com/threeify/threeify/compare/v1.1.1...v1.2.0) (2020-06-26)


### Bug Fixes

* restored example1 triangles index.ts file ([e7a420e](https://github.com/threeify/threeify/commit/e7a420ec758d087c8d8e0a68d37b99c4bf52fff0))
* update directories in examples. ([d928c8c](https://github.com/threeify/threeify/commit/d928c8c0d1fdf46da3996ecf069be22199a1bd69))
* **ci:** fix broken release action ([c304902](https://github.com/threeify/threeify/commit/c304902d15b6c894db9d9f3d30c74e03cc99f38d))
* **ci:** fix checking master on master ([8ed115c](https://github.com/threeify/threeify/commit/8ed115cc9d3aaa3d49e6d19f182d634121c40e65))
* **eslint:** ignore JS example ([a4735fe](https://github.com/threeify/threeify/commit/a4735fe6a0e1dcc9622770733970f2735e023c9c))
* **eslint:** resolve tsconfig paths ([315d3b3](https://github.com/threeify/threeify/commit/315d3b3b6389fc9a275e3671cdca22618f1c3f0f))


### Features

* add debug renderer info support ([c22865a](https://github.com/threeify/threeify/commit/c22865ae21d200d9ba9d08b9a222a75cdc4ef429))
* add Plane and Ray math primitives ([4f15436](https://github.com/threeify/threeify/commit/4f15436ec4dad8552858232b135d77fd911b3a1a))
* Add Plane geometry creator. ([46c88ee](https://github.com/threeify/threeify/commit/46c88ee3a6439f23d530c396afeeebd4d1abc244))
* add stride support to PrimitiveArray ([25d54bc](https://github.com/threeify/threeify/commit/25d54bce793905b2ac63be14732c9203b4b0613e))
* add support for 'WEBGL_debug_shaders' extension ([286f21b](https://github.com/threeify/threeify/commit/286f21ba313a4c9f8991698c77643fc001cf74a8))
* add support for optional anisotropy mipmaps ([5588055](https://github.com/threeify/threeify/commit/5588055215f6ba677d70461a37c4d2dbefdf9127))
* depth texture example ([f85573e](https://github.com/threeify/threeify/commit/f85573e5177b1d0f0dcea37b15ddf8979b2a6450))
* encodings work well ([5fcc413](https://github.com/threeify/threeify/commit/5fcc4134d1af726ab4a7e5c2cde4bdb9632134f0))
* example [#1](https://github.com/threeify/threeify/issues/1) - basic triangle. ([705ab3d](https://github.com/threeify/threeify/commit/705ab3d2515a226ce86a119406266f061ba0f66f))
* example 3, textured & indexed plane. ([ae9660a](https://github.com/threeify/threeify/commit/ae9660a19df3eb9cb40883bcf2a16bda0c512103))
* example 4 lambert cube ([c6269d1](https://github.com/threeify/threeify/commit/c6269d14775441d16e3de850f14c44237d9285ff))
* go back to WebGL1 with guarrenteed extensions. :( ([4b21a2e](https://github.com/threeify/threeify/commit/4b21a2e3e6944dd140693217f3a63abba558328e))
* HDR loader WIP ([73f2581](https://github.com/threeify/threeify/commit/73f25816e3d510cbbdd42719a32ae9e009a9c26b))
* integration test support via ts-jest ([b9cadb7](https://github.com/threeify/threeify/commit/b9cadb780ee24043c5194f7906eb01ab38ec1f8b)), closes [#10](https://github.com/threeify/threeify/issues/10)
* interleaved buffers example (not yet working) ([f4c8620](https://github.com/threeify/threeify/commit/f4c862057d85cef80b7084b44ad5f764d37ad403))
* optimize math class size and dependencies ([ca74267](https://github.com/threeify/threeify/commit/ca74267e9d8e4ce2fbb8c1bfec18ec28bb6ff976))
* orthographic example, fix perspective camera sign bug, improve uniformity of maker-functions. ([fc62362](https://github.com/threeify/threeify/commit/fc62362c185f36095461de20122ffb386ebc0edb))
* render to texture example ([0f7b79d](https://github.com/threeify/threeify/commit/0f7b79d35036402b5dea0ff4a1946c4ca0469385))
* roughness example works ([0132ba9](https://github.com/threeify/threeify/commit/0132ba97284b79d7b8c2f789c77448db070e3c3b))
* second example, animated uniforms ([077d33e](https://github.com/threeify/threeify/commit/077d33ea9082682d84ad9657f131923bbacb09a2))
* simplify framebuffer attachment creation ([515ebbe](https://github.com/threeify/threeify/commit/515ebbe5c2e78910502178251b9f8e29afab9ade))
* tetrahedral, octahedron, isocahedron, dodecahedron, PrimitiveArray ([9c86560](https://github.com/threeify/threeify/commit/9c86560fa9da547329af1e5f3c0e59e67cd4f910))
* upgrade shaders to es 300 (WebGL2 only) ([62e7da7](https://github.com/threeify/threeify/commit/62e7da7a107b84dd7fdf904d275800b7585b4409))
* use module facades in examples ([bd565fb](https://github.com/threeify/threeify/commit/bd565fb286231ff8ea100acf9069015f00b85226))

## [1.1.1](https://github.com/bhouston/threeify/compare/v1.1.0...v1.1.1) (2020-06-13)


### Bug Fixes

* **commit-hook:** fix double commit hook ([502e2ec](https://github.com/bhouston/threeify/commit/502e2ecafd9b4875b210d9d26318806bb3716e89))

# [1.1.0](https://github.com/bhouston/threeify/compare/v1.0.0...v1.1.0) (2020-06-13)

### Features

- **changelog:** store the commitizen git hook ([#34](https://github.com/bhouston/threeify/issues/34)) ([05f72f6](https://github.com/bhouston/threeify/commit/05f72f6ccb17146c8756aab6070bbb013ac76e7c))

# 1.0.0 (2020-06-13)

Manually written:

- Added glsl transpiler to JS modules.
- Added VirtualFramebuffer, CanvasFramebuffer.
- Added MaterialOutputFlags.
- Rename boxGeometry to box.
- Add count and offset to VertexAttributeGeometry, VertexArrayObject.

### Bug Fixes

- fix syntax error in index.ts ([89809f4](https://github.com/bhouston/threeify/commit/89809f453f6196ad7e286ddd6b10e9a8e6c5144e))

### Features

- **changelog:** implement semantic-release and release notes generator ([#33](https://github.com/bhouston/threeify/issues/33)) ([ce3b03d](https://github.com/bhouston/threeify/commit/ce3b03da9e99db8aff5aea14c4da25c79e2fabdb))

### Reverts

- Revert "Revert "Apply linting" - removed all .js extensions on imports." ([e8ba0a3](https://github.com/bhouston/threeify/commit/e8ba0a3e18ab7f5794041c2d6a67fe76a9f60b37))
