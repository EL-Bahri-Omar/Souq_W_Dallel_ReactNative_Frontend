import * as TaskManager from 'expo-task-manager';

TaskManager.defineTask('StripeKeepJsAwakeTask', () => {
  return BackgroundFetch.Result.NewData;
});