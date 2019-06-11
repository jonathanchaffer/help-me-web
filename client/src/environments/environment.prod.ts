import { SESSION_STORAGE, LOCAL_STORAGE, StorageService } from 'angular-webstorage-service';

export const environment = {
  production: true,
	local_storage_mode: LOCAL_STORAGE,
	server: 'https://hopehelpme.herokuapp',
	api_base: '/api'
};
