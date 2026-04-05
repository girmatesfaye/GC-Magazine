/**
 * Downloads Stitch screenshots and HTML references (same as curl -L).
 * Run: node scripts/download-stitch-assets.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const assets = [
  {
    slug: "create-memory",
    png: "https://lh3.googleusercontent.com/aida/ADBb0ujKhjqVmYFuZe0tMspBNUw1B2YN3Po3zNmG-M2rK4n7BRFL1RsuXLGLazlQvrAwzWh3io3eoTtWtue9VC0_y5WU5ub97OnYhmQkeSQ3x4qIqWlEHakVlUjicpIMYVIPuLHmz7kv6AbM4dIVkArL3h44vEqaX5a5BTDvqs3WCLa5tj9DJaSxJvAROfG7loZcqqsv734eoRbTFn3HATHZ8anNaE2tKc3dctHvIISvVZWJuH_u-darH6JCTH8",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzBhNjZhNWU1ODVkODRkNzA5ZTVjNjBlYzhhODA2ZjkwEgsSBxCj4OWgmxMYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYzMjc2NTQyNDYzNzk3NDAxMA&filename=&opi=89354086",
  },
  {
    slug: "onboarding",
    png: "https://lh3.googleusercontent.com/aida/ADBb0ujhcaDDMoa5DecCFm2IjknpTjGpc6GcP8eg13qGvC19hQL_3v5hf-ZL544qptC3PHG67iifuq3WPWNTMWsm1kzrvSQ9B6zAez6dpyqZapjMRJn0RWvgmkeLvdlDGTfgsuMzAGh4nCuZylm0iXlVp3ZHkXAsxLqKH-aRma0vKDyJ2TiuTHw1BK0yGbcLzaRPVRb_80u48IrMK4YAiFv1tG3SZn4X3vHBbkbCSuWqD0WpG440z0NLNav8IxU7",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ZhMDZiNTZjMmZmNzQ5MTlhZjMyNjNlMGIyNzZjYWMyEgsSBxCj4OWgmxMYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYzMjc2NTQyNDYzNzk3NDAxMA&filename=&opi=89354086",
  },
  {
    slug: "onboarding-connect",
    png: "https://lh3.googleusercontent.com/aida/ADBb0ujTW-rsFp3ZQdLQkkToj7Tqti_CheS2H-KM5_RfpgPzNSqngYzC8mMLf1yKakRHn2bhwh2X7Zz69IrCkH6zxr1cJT-R_m0H-RYleCz_tBdzkmn85XksyAYiDGup0DVRscL0fTzRIF77eeo-iOQX3lIuR_gnLgcgSH9CwV5gYWqfFZADf2Hh3_YOHFpCmDzbTQ-UNbjrsl9d58Qg3u5ZFWNDvfkiatm-96PHq_8rpGF7vLbzmoqME2vuCBLt",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Q5OWJkMDFhY2UxZjRhOGQ4ZDE0N2VhYWNiMjY4OThkEgsSBxCj4OWgmxMYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYzMjc2NTQyNDYzNzk3NDAxMA&filename=&opi=89354086",
  },
  {
    slug: "profile",
    png: "https://lh3.googleusercontent.com/aida/ADBb0ug5KHNj1df2cPqpDWx8MpokwamUYWMtl515fmbbs8mrEmOb9CwIsThBY0v3704fmcRnmujxYFx_yedNElRSw6da4M_5eVkaeJh3OQYceIjYfuggnWjUF1VyrYXAkvmcTRH7VyERDkAp2qLFWD5EefvpBCA1JJwfuNSVhWwqeKibbFgVDir-k1iThCVM88vXQ2C33vWWvoP2vcSC-l6X-Lgw0c1SV-4_EeDx0CHoPSljV_VQf0uCbifj87w6",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzA1MzI2MjMyMThlNzQwZjJhNWZlZTFmYjNkNWYzMzI1EgsSBxCj4OWgmxMYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYzMjc2NTQyNDYzNzk3NDAxMA&filename=&opi=89354086",
  },
  {
    slug: "onboarding-archive",
    png: "https://lh3.googleusercontent.com/aida/ADBb0ujGVKhYUvnNFbzTzjP0lWrz75eW9T6r5JUcQJaZHgmexNnxeGPADNdrFI1uHHur9oNedfgydKzV9p4VORIe5pAEbN6rU7uqK_o0ZWjRCf0QN7pVGY0cA7Byovz6_8eO83MrXofwCkGuF-lZORGNwUSywQzH17PISWvu0Ln8FFodLe_TwkAKgJtV0x2-8PgAWlyx-NtokVPpr59pN76LDvkd-2B6MtesSM3DqvubI3p0YAQNaovNB1-07oQ",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2ExNzE1NzRmYzIwZjRkYTg4MGM0NTkzY2MzZGJlNzIyEgsSBxCj4OWgmxMYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYzMjc2NTQyNDYzNzk3NDAxMA&filename=&opi=89354086",
  },
  {
    slug: "memory-detail",
    png: "https://lh3.googleusercontent.com/aida/ADBb0uj9l1EkD0oBhcl-7WhK0XtehpST4JjlORGj_1Zd1OIaYgrTQx6jAFD_MpExcSZiho7Erq6KY2p_qMil4nIqw1Qgh8yUiBUxgrw22EVSm-L6wCiJsRyLe62kvAPqjHmsACceTQMpzz4DTs9UhI7PYXpPS8JcZ6NurXo3EOL3e02mHAIdiKKGmCC4rlux5hNTP2xbdp3SxNfwjzpOfKlpauUt-eM_cH6Y-9do3Z7qzvv0m8zfRN0KB5snoBhP",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzBkODQ5ZmJiYzMwYzRmOTE4YmVhOGFmYTE3NjNkYmIxEgsSBxCj4OWgmxMYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYzMjc2NTQyNDYzNzk3NDAxMA&filename=&opi=89354086",
  },
  {
    slug: "user-setup",
    png: "https://lh3.googleusercontent.com/aida/ADBb0uik18s700NpfeVpS88mpO3eVhbUEbGo4NTNOORUMfGKjpyNkd6ox8otZUYCY1bvh3Hf9LckmkmXM1pZIeYKRwk01tdmD1fSYXRd8dPtygB6Y-awk6Ff0uTEWjTzGsrwb-h9NKqVhF6W874iofCwzuL3keGAWmR0o0tBBATd2Wo6WMPXCBgBEaJYIKv6zBc-gnPivdqHXKv0b9Orqn6VLb4dy6nPs8vcoey3_dxEKDNMk1o22oOsI1Dq91WP",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzA3ODA0MmIyODE0ODRjZmE4ZDk3ZGQ0YzdkYzI2Yjg2EgsSBxCj4OWgmxMYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYzMjc2NTQyNDYzNzk3NDAxMA&filename=&opi=89354086",
  },
  {
    slug: "home-feed",
    png: "https://lh3.googleusercontent.com/aida/ADBb0uiPl5s-UQn0Dvn25MutM8Jq36mL96l5rsTdK1VFu9YoD_XrGnubhWwAlr23H1TARxrG36rpizefWBbczEK5CiEJ23jDskeGgoTCchb9n7VbEuWc9d3bauN3LJsIKnmRKUIRsIAIztFVx6pMSFgNCTzP20MeoLPOx_h4lZvn-MWP5xn3s_vEYh-XJt5E3xwF2R8RUHPKyNE-iTPm7vrluMH_8Z9ng6iCPg7ZCMu670DsWaKsbkSgV6WQlzyi",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzJmN2NkM2UyZjQ5MzQ4Y2M4YjE1ZTMyZWEzYTRiNWZiEgsSBxCj4OWgmxMYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYzMjc2NTQyNDYzNzk3NDAxMA&filename=&opi=89354086",
  },
  {
    slug: "onboarding-capture",
    png: "https://lh3.googleusercontent.com/aida/ADBb0uh5-xzZ0brh8Z4S5_CNOM4hy-up36Aa4bK8ZD2ShQf3iPQTtsg9UDWPv-1iJwH6Jrk27kkf2Z1UxFJQbzRfm2MXt4f46uj0OKUFOcCpP67KnYFiwRXiYnB8Dnim67XCktve3uOeJsVHxF97mG2cdTDMnbj6lLs0OK3EoVPonCBrOD895jRzPu5rkqSj0nl1d6TwDnfsavYL3Ngsw90BlFJfXIO7__DU1hJjqRb9Jp2BoY-q4L9rgQC_9zrl",
    html: "https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzU3Y2U3Y2M2NjA5NjRiYjM5YmY4MDFhMjFhNjI1MzA3EgsSBxCj4OWgmxMYAZIBJAoKcHJvamVjdF9pZBIWQhQxNTYzMjc2NTQyNDYzNzk3NDAxMA&filename=&opi=89354086",
  },
];

async function download(url, dest) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

const pngDir = path.join(root, "assets", "stitch");
const htmlDir = path.join(root, "design-reference", "stitch-html");
fs.mkdirSync(pngDir, { recursive: true });
fs.mkdirSync(htmlDir, { recursive: true });

for (const item of assets) {
  const pngPath = path.join(pngDir, `${item.slug}.png`);
  const htmlPath = path.join(htmlDir, `${item.slug}.html`);
  process.stdout.write(`Fetching ${item.slug}… `);
  try {
    await download(item.png, pngPath);
    await download(item.html, htmlPath);
    console.log("ok");
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  }
}
