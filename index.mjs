import container from './app/container';
const app = container.resolve('app');

app
  .start()
  .catch((error) => {
    console.warn(error);
    process.exit();
  });
