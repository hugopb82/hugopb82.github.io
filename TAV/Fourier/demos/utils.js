export function get_module_path(filename) {
	return filename.substring(0, filename.lastIndexOf('/'))
}