package com.realreview.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import org.json.JSONObject;

@Service
public class LocationValidatorService {

    @Value("${google.maps.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public LocationData validateLocation(String address) {
        try {
            String url = "https://maps.googleapis.com/maps/api/geocode/json?address="
                    + address.replace(" ", "+") + "&key=" + apiKey;

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JSONObject json = new JSONObject(response.getBody());

            if (!json.getString("status").equals("OK")) {
                throw new RuntimeException("Invalid or unrecognized location");
            }

            JSONObject location = json.getJSONArray("results")
                    .getJSONObject(0)
                    .getJSONObject("geometry")
                    .getJSONObject("location");

            double lat = location.getDouble("lat");
            double lng = location.getDouble("lng");
            String formattedAddress = json.getJSONArray("results")
                    .getJSONObject(0)
                    .getString("formatted_address");

            return new LocationData(formattedAddress, lat, lng);

        } catch (Exception e) {
            throw new RuntimeException("Failed to validate location: " + e.getMessage());
        }
    }

    // Simple DTO for returning location data
    public record LocationData(String formattedAddress, double latitude, double longitude) {}
}
