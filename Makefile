.PHONY: clean

rfm12b_ioctl.js: build/generate_ioctl
	build/generate_ioctl

build/generate_ioctl: rfm12b_ioctl_js.cc
	mkdir -p build
	g++ -I ../rfm12b-linux -o $@ -std=c++11 $<

clean:
	-rm -rf build

