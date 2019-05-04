DIR=.
BUILD_DIR=build
DIST_DIR=dist

define copy-files
	mkdir -p ${DIR}/${BUILD_DIR}/${1}/icons ${DIR}/${BUILD_DIR}/${1}/images ${DIR}/${BUILD_DIR}/${1}/scripts ${DIR}/${BUILD_DIR}/${1}/styles
	cp ${DIR}/src/icons/* ${DIR}/${BUILD_DIR}/${1}/icons 2>/dev/null || true
	cp ${DIR}/src/images/${1}/* ${DIR}/src/images/shared/* ${DIR}/${BUILD_DIR}/${1}/images 2>/dev/null || true
	cp ${DIR}/src/scripts/* ${DIR}/${BUILD_DIR}/${1}/scripts 2>/dev/null || true
	cp ${DIR}/src/styles/* ${DIR}/${BUILD_DIR}/${1}/styles 2>/dev/null || true
	cp ${DIR}/src/*.html ${DIR}/${BUILD_DIR}/${1} 2>/dev/null || true
	cp ${DIR}/manifest.json ${DIR}/LICENSE ${DIR}/${BUILD_DIR}/${1} 2>/dev/null || true
endef

define zip-files
	mkdir -p ${DIR}/${DIST_DIR}
	(cd ${DIR}/${BUILD_DIR}/${1} && zip -r - .) > ${DIR}/${DIST_DIR}/${1}.zip
endef

build: clean build-firefox build-chrome

build-firefox:
	$(call copy-files,firefox)

build-chrome:
	$(call copy-files,chrome)

dist: build dist-firefox dist-chrome

dist-firefox:
	$(call zip-files,firefox)

dist-chrome:
	$(call zip-files,chrome)

clean:
	rm -rf ${DIR}/${BUILD_DIR} ${DIR}/${DIST_DIR}