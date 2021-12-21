package io.hexlet.javaspringblog.model;

import io.hexlet.javaspringblog.model.Post;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import static javax.persistence.GenerationType.AUTO;

@Getter
@Setter
@ToString(callSuper = true)
@NoArgsConstructor
@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class PostComment {

    @Id
    @GeneratedValue(strategy = AUTO)
    private Long id;

    @NotNull
    @NotBlank
    @Size(max = 200)
    private String body;

    @NotNull
    @ManyToOne
    @ToString.Exclude
    private Post post;

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public boolean equals(Object obj) {
        return this == obj || id != null && obj instanceof PostComment other && id.equals(other.id);
    }
}
