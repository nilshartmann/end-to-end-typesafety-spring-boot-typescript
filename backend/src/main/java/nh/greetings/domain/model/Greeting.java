package nh.greetings.domain.model;

import jakarta.validation.constraints.NotNull;

public class Greeting {

    private @NotNull Long id;
    private @NotNull String phrase;
    private @NotNull String name;
    private @NotNull GreetingType greetingType;

    public Greeting(Long id, String phrase, String name, GreetingType greetingType) {
        this.id = id;
        this.phrase = phrase;
        this.name = name;
        this.greetingType = greetingType;
    }

    public Long getId() {
        return id;
    }

    public GreetingType getGreetingType() {
        return greetingType;
    }

    public void setGreetingType(GreetingType greetingType) {
        this.greetingType = greetingType;
    }

    public String getPhrase() {
        return phrase;
    }

    public void setPhrase(String phrase) {
        this.phrase = phrase;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
