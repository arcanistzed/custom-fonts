/** Recursively browse for all files in a directory including subdirectories
 * @param {string} directory The directory to browse
 * @return {Promise<string[]>} All of the files in the directory and it's subdirectories
 */
export async function recursiveFileBrowse(directory) {
    const res = await FilePicker.browse("data", directory);
    const files = res.files;
    for (const dir of res.dirs)
        files.push(...await recursiveFileBrowse(dir));
    return files;
};
