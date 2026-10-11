package com.smartjobportal.repository;

import com.smartjobportal.model.Role;
import com.smartjobportal.model.User;
import com.smartjobportal.model.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    long countByRole(Role role);
    long countByStatus(UserStatus status);

    @Query("SELECT u FROM User u WHERE " +
           "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%',:search,'%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%',:search,'%'))) AND " +
           "(:role IS NULL OR u.role = :role) AND " +
           "(:status IS NULL OR u.status = :status)")
    Page<User> findWithFilters(@Param("search") String search,
                               @Param("role") Role role,
                               @Param("status") UserStatus status,
                               Pageable pageable);

    long countByRoleAndStatus(Role role, UserStatus status);
}
