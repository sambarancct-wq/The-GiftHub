package com.giftregistry.server.repository;

import com.giftregistry.server.model.User;
import com.giftregistry.server.model.Event;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByOrganizer(User organizer);
    List<Event> findByOrganizerId(Long organizerId);
    boolean existsByNameAndOrganizer(String name, User organizer);
}