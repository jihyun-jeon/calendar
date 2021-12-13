export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://apis.data.go.kr',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
};
