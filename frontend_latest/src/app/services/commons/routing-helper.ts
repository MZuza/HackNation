export abstract class RoutingHelper {
  /**
   * Checks if the given url is the main page.
   *
   * @param url
   */
  public static isHomePage(url: string): boolean {
    return url.length === 1 || url.length === 3 || url.startsWith('/pl?') || url.startsWith('/en?');
  }
}
