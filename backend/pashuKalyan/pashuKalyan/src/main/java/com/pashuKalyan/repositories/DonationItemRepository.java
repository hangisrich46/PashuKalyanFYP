package com.pashuKalyan.repositories;

import com.pashuKalyan.model.DonationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationItemRepository extends JpaRepository<DonationItem, Long> {

    /**
     * Find all donation items for a particular donation
     *
     * @param donationId the donation ID
     * @return list of donation items
     */
    List<DonationItem> findAllByDonationId(Long donationId);
}