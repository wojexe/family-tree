function buf2hex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}

export const stringToSHA1 = async (data: string) => {
  let arrayBuffer = await crypto.subtle.digest(
    "SHA-1",
    new TextEncoder().encode(data)
  );

  return buf2hex(arrayBuffer);
};
