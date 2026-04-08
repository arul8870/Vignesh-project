import { apiClient } from "../api/apiClients";
import { HTTP_METHODS } from "../utils/constants";

class PlacementRepository {
  async getUpdates() {
    return apiClient.apiCall("placement:getUpdates", "/updates", HTTP_METHODS.GET);
  }

  async addUpdate(data) {
    return apiClient.apiCall("placement:addUpdate", "/updates", HTTP_METHODS.POST, data);
  }

  async updateUpdate(id, data) {
    return apiClient.apiCall("placement:updateUpdate", "/updates", HTTP_METHODS.PATCH, { id, updates: data });
  }

  async deleteUpdate(id) {
    return apiClient.apiCall("placement:deleteUpdate", "/updates", HTTP_METHODS.DELETE, { id });
  }

  async getAnnouncements() {
    return apiClient.apiCall("placement:getAnnouncements", "/announcements", HTTP_METHODS.GET);
  }

  async addAnnouncement(data) {
    return apiClient.apiCall("placement:addAnnouncement", "/announcements", HTTP_METHODS.POST, data);
  }

  async updateAnnouncement(id, data) {
    return apiClient.apiCall("placement:updateAnnouncement", "/announcements", HTTP_METHODS.PATCH, { id, updates: data });
  }

  async deleteAnnouncement(id) {
    return apiClient.apiCall("placement:deleteAnnouncement", "/announcements", HTTP_METHODS.DELETE, { id });
  }

  async getApplications() {
    return apiClient.apiCall("placement:getApplications", "/applications", HTTP_METHODS.GET);
  }

  async addApplication(data) {
    return apiClient.apiCall("placement:addApplication", "/applications", HTTP_METHODS.POST, data);
  }

  async updateApplication(id, updates) {
    return apiClient.apiCall("placement:updateApplication", "/applications", HTTP_METHODS.PATCH, { id, updates });
  }

  async deleteApplication(id) {
    return apiClient.apiCall("placement:deleteApplication", "/applications", HTTP_METHODS.DELETE, { id });
  }

  async getJobs() {
    return apiClient.apiCall("placement:getJobs", "/jobs", HTTP_METHODS.GET);
  }

  async addJob(data) {
    return apiClient.apiCall("placement:addJob", "/jobs", HTTP_METHODS.POST, data);
  }

  async deleteJob(id) {
    return apiClient.apiCall("placement:deleteJob", "/jobs", HTTP_METHODS.DELETE, { id });
  }

  async getHallOfFame() {
    return apiClient.apiCall("placement:getHallOfFame", "/students", HTTP_METHODS.GET);
  }
}

export const placementRepository = new PlacementRepository();
