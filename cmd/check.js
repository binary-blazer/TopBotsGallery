import dotenv from "dotenv";
import fs from "node:fs";
import axios from "axios";

dotenv.config();

const API_TOKEN = process.env.TOP_GG_TOKEN;
const API_URL = "https://top.gg/api/bots?sort=server_count&limit=20";

const headers = {
  Authorization: API_TOKEN,
};

let readmeFileFormat = `# TopBotsGallery\n🤖 20 of the most popular Discord bots are listed in one list. Daily updated.\n\n`;

function formatCount(count) {
  return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

await axios
  .get(API_URL, { headers: headers })
  .then((response) => {
    const bots = response.data.results;

    let maxNameLength = Math.max(
      "Bot".length,
      ...bots.map((bot) => `${bot.username}#${bot.discriminator}`.length),
    );
    let maxServerCountLength = Math.max(
      "Server Count".length,
      ...bots.map((bot) => formatCount(bot.server_count).length),
    );
    let maxInviteLength = Math.max(
      "Invite".length,
      ...bots.map(() => `Click here to invite`.length),
    );

    readmeFileFormat += `| ${"Bot".padEnd(
      maxNameLength,
    )} | ${"Server Count".padEnd(maxServerCountLength)} | ${"Invite".padEnd(
      maxInviteLength,
    )} |\n| ${"-".repeat(maxNameLength)} | ${"-".repeat(
      maxServerCountLength,
    )} | ${"-".repeat(maxInviteLength)} |`;

    bots.forEach((bot) => {
      readmeFileFormat += `\n| ${`\`${bot.username}#${bot.discriminator}\``.padEnd(
        maxNameLength,
      )} | ${formatCount(bot.server_count).padEnd(
        maxServerCountLength,
      )} | [Click here to invite](${bot.invite}) |`;
    });

    readmeFileFormat += `\n\n## ⚠️ Disclaimer\n> This list might not include all of the most popular bots. This list is based on the [top.gg](https://top.gg) API.\nAlso, we are not affiliated with top.gg in any way.`;
    readmeFileFormat += `\n\n## 📝 License\nThis project is licensed under the Apache-2.0 License. See the [LICENSE](https://github.com/binary-blazer/TopBotsGallery/blob/main/LICENSE) file for details or see below.\n\n`;

    const licenseFileFormat = fs.readFileSync("LICENSE", "utf8");
    readmeFileFormat += `\`\`\`\n${licenseFileFormat}\n\`\`\``;

    fs.writeFileSync("README.md", readmeFileFormat);
  })
  .catch((error) => {
    console.log(error);
  });
