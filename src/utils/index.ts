export function DownloadFlie(fileUrl: string, fileName?: string) {
  return new Promise(resolve => {
    let link = document.createElement("a");
    link.href = fileUrl;
    link.download = "";
    link.click();
    resolve(true);
  });
}
