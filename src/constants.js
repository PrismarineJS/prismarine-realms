module.exports = {
  PlatformConstants: (platform) => {
    return {
      Host: (platform === 'bedrock') ? 'https://pocket.realms.minecraft.net' : 'https://pc.realms.minecraft.net',
      UserAgent: (platform === 'bedrock') ? 'MCPE/UWP' : 'MinecraftLauncher/2.2.10675'
    }
  },
  BedrockRealmsRelyingParty: 'https://pocket.realms.minecraft.net/'
}
