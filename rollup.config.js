import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/app.ts',
  output: {
    dir: 'dist',
  },
  plugins: [typescript()]
};
