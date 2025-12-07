import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentNameStrategyService {
  /**
   * Current environment name
   */
  envName = environment.name;

  /**
   * Check if environment names from flag strategy include current env name
   * @param {string} envNames
   * @return {boolean}
   */
  validateStrategy(envNames: string): boolean {
    const envs = envNames.toLowerCase().split(',');
    return envs.findIndex(el => el === this.envName) >= 0;
  }
}
