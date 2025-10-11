package com.giftregistry.server.repository;

import com.giftregistry.server.model.Event;
import com.giftregistry.server.model.RSVP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RSVPRepository extends JpaRepository<RSVP, Long> {
    List<RSVP> findByEvent(Event event);
    long countByEventAndStatus(Event event, RSVP.RSVPStatus status);
}