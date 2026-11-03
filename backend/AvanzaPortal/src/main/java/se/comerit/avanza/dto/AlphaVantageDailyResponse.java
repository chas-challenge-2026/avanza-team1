package se.comerit.avanza.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;

public record AlphaVantageDailyResponse(
        @JsonProperty("Meta Data")
        Map<String, String> metaData,

        @JsonProperty("Time Series (Daily)")
        Map<String, TimeSeriesData> timeSeries
) {
    public record TimeSeriesData(
            @JsonProperty("1. open") String open,
            @JsonProperty("2. high") String high,
            @JsonProperty("3. low") String low,
            @JsonProperty("4. close") String close,
            @JsonProperty("5. volume") String volume
    ) {}
}