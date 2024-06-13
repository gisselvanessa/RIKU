export function getFileType(url: string): string {
    const extension = url.substring(url.lastIndexOf(".")).toLowerCase();
    if (['.jpg', '.png', '.jpeg', '.gif', '.tiff', '.jfif'].includes(extension)) {
        return 'image';
    } else if (['.psd', '.pdf', '.ai', '.indd'].includes(extension)) {
        return 'pdf';
    } else {
        return 'doc';
    }
}

export function getFileName(url: string): string {
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  return fileName;
}
