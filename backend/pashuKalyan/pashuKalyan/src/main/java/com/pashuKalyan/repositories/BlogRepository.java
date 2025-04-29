package com.pashuKalyan.repositories;

import com.pashuKalyan.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<BlogPost, Long> {

    List<BlogPost> findAllByOrderByDateDesc();
}