package nh.greetings.domain.model;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class GreetingRepository {

    private static final Logger log = LoggerFactory.getLogger(GreetingRepository.class);

    private final List<Greeting> greetings = List.of(
        new Greeting(1L, "Hello", "Klaus", GreetingType.CASUAL),
        new Greeting(2L, "Hi", "Susi", GreetingType.PERSONAL),
        new Greeting(3L, "I hope your doing fine", "Mr. Smith", GreetingType.FORMAL)
    );

    public List<Greeting> findAll() {
        return greetings;
    }

    public Optional<Greeting> findById(Long id) {
        var result = this.greetings.stream().filter(g -> g.getId().equals(id)).findAny();
        log.info("Result for greeting id '{}': {}", id, result);
        return result;
    }

    public Greeting save(Greeting greeting) {
        // no-op
        return greeting;
    }
}
