package com.example.backend.Repository;

import com.example.backend.Entity.Role;
import com.example.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepo extends JpaRepository<User, UUID> {
    Optional<User> findByPhone(String phone);

    @Query("SELECT u FROM User u WHERE :role MEMBER OF u.roles")
    List<User> findAllByRole(Role role);

}
