function formatJavaAuth (res) {
  if (!res.profile?.id || !res.profile?.name) throw new Error('Failed to obtain profile data, does the authenticating account own minecraft?')
  return ['cookie', `sid=token:${res.token}:${res.profile.id}; user=${res.profile.name}; version=0.0.0`]
}

function formatBedrockAuth (res) {
  return ['authorization', `XBL3.0 x=${res.userHash};${res.XSTSToken}`]
}

async function getBedrockVersion() {
  const res = await fetch("https://itunes.apple.com/lookup?bundleId=com.mojang.minecraftpe");
  const data = await res.json();
  if (!data.results?.length) {
    throw new Error("Failed to fetch latest version of Minecraft: Bedrock Edition");
  }
  const version = data.results[0].version;
  return version.startsWith("1.") ? version : `1.${version}`;
}

module.exports = {
  formatJavaAuth,
  formatBedrockAuth,
  getBedrockVersion
}
