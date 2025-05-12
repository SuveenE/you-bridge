import ngrok from 'ngrok';
import log from 'electron-log';

interface NgrokTunnel {
  url: string;
  path: string;
}

class ExposeEndpointService {
  private tunnels: Map<string, NgrokTunnel> = new Map();

  /**
   * Exposes a specific path on a local endpoint to the public internet using ngrok
   * @param port The local port to expose
   * @param path The specific path to expose (e.g., '/photos' or '/texts')
   * @returns The public URL where the endpoint is accessible
   */
  async exposePath(port: number, path: string): Promise<string> {
    try {
      // Kill existing tunnel for this path if it exists
      await this.killTunnelForPath(path);

      // Create a new tunnel with path-based routing
      const url = await ngrok.connect({
        addr: port,
        proto: 'http',
        bind_tls: true,
        inspect: false,
        basic_auth: undefined,
        subdomain: undefined,
        hostname: undefined,
        path: path,
      });

      this.tunnels.set(path, {
        url,
        path,
      });

      log.info(`Path ${path} exposed at: ${url}`);
      return url;
    } catch (error) {
      log.error(`Failed to expose path ${path}:`, error);
      throw error;
    }
  }

  /**
   * Kills the tunnel for a specific path
   * @param path The path whose tunnel should be killed
   */
  async killTunnelForPath(path: string): Promise<void> {
    try {
      const tunnel = this.tunnels.get(path);
      if (tunnel) {
        await ngrok.kill();
        this.tunnels.delete(path);
        log.info(`Killed tunnel for path: ${path}`);
      }
    } catch (error) {
      log.error(`Failed to kill tunnel for path ${path}:`, error);
      throw error;
    }
  }

  /**
   * Kills all active tunnels
   */
  async killAllTunnels(): Promise<void> {
    try {
      await ngrok.kill();
      this.tunnels.clear();
      log.info('Killed all tunnels');
    } catch (error) {
      log.error('Failed to kill all tunnels:', error);
      throw error;
    }
  }

  /**
   * Gets the current public URL for a specific path if a tunnel is active
   * @param path The path to get the URL for
   * @returns The current public URL or null if no tunnel is active for that path
   */
  getUrlForPath(path: string): string | null {
    return this.tunnels.get(path)?.url || null;
  }

  /**
   * Gets all active tunnel URLs
   * @returns A map of paths to their public URLs
   */
  getAllTunnelUrls(): Map<string, string> {
    const urls = new Map<string, string>();
    this.tunnels.forEach((tunnel, path) => {
      urls.set(path, tunnel.url);
    });
    return urls;
  }
}

export default new ExposeEndpointService();
