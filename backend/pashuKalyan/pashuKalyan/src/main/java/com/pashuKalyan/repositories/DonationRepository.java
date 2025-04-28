// DonationRepository.java
package com.pashuKalyan.repositories;

import com.pashuKalyan.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {

    /**
     * Find a donation by its transaction UUID
     *
     * @param uuid the transaction UUID
     * @return optional containing the donation if found
     */
    Optional<Donation> findByTransactionUuid(String uuid);

    /**
     * Find all donations by user ID
     *
     * @param userId the user ID
     * @return list of donations
     */
    List<Donation> findAllByUserId(Long userId);
}

