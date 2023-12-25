package nh.greetings.domain.api;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import nh.greetings.domain.model.Greeting;
import nh.greetings.domain.model.GreetingRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, path = "/api")
@CrossOrigin(origins = "http://localhost:8090")
@OpenAPIDefinition(info = @Info(title = "Greeting Example", description = "Simple App"))
public class GreetingController {

    // Path Variables
    // Search Parameter:
    //  - enum
    //  - string
    // Request Payload:
    //  - object mit not null und optional
    // Response:
    //  - "readable" enum

    private final GreetingRepository respository;

    public GreetingController(GreetingRepository respository) {
        this.respository = respository;
    }

    record ApiResponse<T>(@NotNull T data) {
        static <T> ApiResponse<T> of(T data) {
            return new ApiResponse<>(data);
        }

        static <T> ResponseEntity<ApiResponse<T>> inResponse(T data) {
            ApiResponse<T> response = new ApiResponse<>(data);
            return ResponseEntity.ok(response);
        }
    }

    record GreetingSummary(@NotNull Long id, @NotNull @Size(max = 1024) String name) {
        static GreetingSummary of(Greeting greeting) {
            return new GreetingSummary(greeting.getId(), greeting.getName());
        }
    }

    // --------------------------------------------------------------------------------
    // -- EXAMPLE: Simple Response Object (DTO)
    // --------------------------------------------------------------------------------
    @GetMapping("/greetings")
    ApiResponse<List<GreetingSummary>> greetings() {
        var greetings = respository.findAll().stream().map(GreetingSummary::of).toList();
        return ApiResponse.of(greetings);
    }

    // --------------------------------------------------------------------------------
    // -- EXAMPLE: Request Params
    // --------------------------------------------------------------------------------
    @GetMapping("/greetings/search")
    ApiResponse<List<GreetingSummary>> greetings(@RequestParam String name) {
        var greetings = respository.findAll().
            stream().filter(g -> g.getName().equals(name))
            .map(GreetingSummary::of).toList();
        return ApiResponse.of(greetings);
    }

    // --------------------------------------------------------------------------------
    // -- EXAMPLE: Path Variable
    // --------------------------------------------------------------------------------
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(description = "Not found", responseCode = "404",
            content = @Content(mediaType = "application/json",
                schema = @Schema(implementation = String.class)))})
    @GetMapping("/greetings/{greetingId}")
    ResponseEntity<ApiResponse<Greeting>> greetingById(@PathVariable Long greetingId) {
        return respository.findById(greetingId)
            .map(ApiResponse::inResponse)
            .orElseGet(() -> ResponseEntity.notFound().build()
            );
    }

    // --------------------------------------------------------------------------------
    // -- EXAMPLE: Path Variable and Payload
    // --------------------------------------------------------------------------------
    record UpdateGreetingPayload(@NotNull String name, @NotNull String phrase) {
    }

    @PutMapping("/greetings/{greetingId}")
    ResponseEntity<ApiResponse<Greeting>> updateGreetingById(@PathVariable Long greetingId,
                                                             @Valid @RequestBody UpdateGreetingPayload payload) {
        var greeting = respository.findById(greetingId).orElse(null);

        if (greeting == null) {
            throw new IllegalArgumentException("Greeting not found");
        }

        greeting.setName(payload.name());
        greeting.setPhrase(payload.phrase());

        return ApiResponse.inResponse(respository.save(greeting));
    }


}
