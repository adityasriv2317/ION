// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.exclusionListRE =
  /node_modules\/.*\/node_modules\/.*|android\/.*|ios\/.*/;

module.exports = config;
