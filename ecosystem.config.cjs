module.exports = {
  apps: [
    {
      name: 'server',
      script: './src/app.ts',
      interpreter: 'node',
      interpreterArgs: '--import tsx',
    },
  ],
};
