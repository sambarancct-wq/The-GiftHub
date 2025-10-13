package com.giftregistry.server.repository;

import com.giftregistry.server.model.Event;
import com.giftregistry.server.model.Gift;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface GiftRepository extends JpaRepository<Gift, Long> {
    List<Gift> findByEvent(Event event);
    List<Gift> findByEventId(Long eventId);
    List<Gift> findByStatus(Gift.GiftStatus status);
    List<Gift> findByEventIdAndPlannedById(Long eventId, Long userId);
    List<Gift> findByEventIdAndPlannedByIdAndStatus(Long eventId, Long userId, Gift.GiftStatus status);
}