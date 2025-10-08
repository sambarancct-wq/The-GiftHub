package com.giftregistry.server.repository;

import com.giftregistry.server.model.User;
import com.giftregistry.server.model.Event;
import com.giftregistry.server.model.Event.EventType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizer(User organizer);
    List<Event> findByOrganizerId(Long organizerId);
    boolean existsByNameAndOrganizer(String name, User organizer);
    List<Event> findByType(EventType type);
    List<Event> findByDateAfter(LocalDate today);
}