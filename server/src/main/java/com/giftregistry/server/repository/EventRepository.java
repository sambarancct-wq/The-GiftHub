package com.giftregistry.server.repository;

import com.giftregistry.server.model.User;
import com.giftregistry.server.model.Event;
import com.giftregistry.server.model.Event.EventType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByType(EventType type);
    List<Event> findByDateAfter(LocalDate today);
    boolean existsByNameAndCreator(String name, User creatorUser);
    List<Event> findByCreatorId(Long creatorId);
    List<Event> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String query, String query2);
    Optional<Event> findByEventKey(String eventKey);
}